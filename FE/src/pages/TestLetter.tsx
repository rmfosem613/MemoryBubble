import React, { useState, useRef, useEffect } from 'react';

const TestLetter = () => {
  // 상태 관리
  const [text, setText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageContents, setPageContents] = useState<string[]>(['']);

  // 상수
  const LINES_PER_PAGE = 6;
  const LINE_HEIGHT = 40; // 픽셀
  const PAGE_HEIGHT = LINES_PER_PAGE * LINE_HEIGHT;

  // 참조
  const paperRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // 텍스트 변경 핸들러
  const handleTextChange = (e) => {
    setText(e.target.value);
    // 텍스트 변경 시에는 페이지 자동 업데이트를 수행하지 않음
    // 이렇게 하면 입력 중 페이지 간 왔다갔다 하는 문제 해결
  };

  // 텍스트를 페이지별로 분할하는 함수
  const splitTextIntoPages = (fullText) => {
    if (!overlayRef.current) return [''];

    // 임시 요소에 텍스트 설정
    overlayRef.current.innerHTML = '';
    
    const pages: string[] = [];
    let currentPageText = '';
    let lineCount = 0;
    
    // 각 줄마다 처리
    fullText.split('\n').forEach(line => {
      // 줄 추가
      if (lineCount < LINES_PER_PAGE) {
        currentPageText += (currentPageText ? '\n' : '') + line;
        lineCount++;
      } else {
        // 페이지 완성, 새 페이지 시작
        pages.push(currentPageText);
        currentPageText = line;
        lineCount = 1;
      }
    });
    
    // 마지막 페이지 추가
    if (currentPageText) {
      pages.push(currentPageText);
    }
    
    // 빈 페이지라도 하나는 필요
    if (pages.length === 0) {
      pages.push('');
    }
    
    return pages;
  };

  // 텍스트 변경 시 페이지 분할 및 페이지 수 업데이트
  useEffect(() => {
    const pages = splitTextIntoPages(text);
    setPageContents(pages);
    setPageCount(pages.length);
    
    // 현재 페이지가 유효한지 확인
    if (currentPage > pages.length) {
      setCurrentPage(pages.length);
    }
    
    // 텍스트가 변경되었을 때는 자동 페이지 이동을 하지 않음
    // 커서 위치 기반 페이지 이동은 명시적인 커서 이동 이벤트에서만 처리
  }, [text]);

  // 페이지 변경 핸들러
  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= pageCount) {
      setCurrentPage(pageNum);

      // 해당 페이지의 시작 위치에 커서 위치시키기
      if (editorRef.current) {
        editorRef.current.focus();

        // 현재 페이지 이전까지의 모든 텍스트 길이 계산
        let position = 0;
        for (let i = 0; i < pageNum - 1; i++) {
          position += pageContents[i].length + 1; // +1은 페이지 구분을 위한 줄바꿈
        }

        editorRef.current.setSelectionRange(position, position);
      }
    }
  };

  // 키 입력 처리
  const handleKeyDown = (e) => {
    // 엔터키를 한 번만 처리하도록 수정
    if (e.key === 'Enter' && e.shiftKey) {
      // Shift + Enter는 기본 동작 유지 (줄바꿈)
      return;
    }
    
    // 화살표 키 이동에만 반응하도록 수정
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
      // 약간의 지연을 두어 키 입력 후 커서 이동이 완료된 후 페이지 업데이트
      setTimeout(() => {
        if (editorRef.current) {
          updatePageBasedOnCursorPosition(editorRef.current.selectionStart);
        }
      }, 10);
    }
  };
  
  // 커서 위치에 따라 페이지 업데이트
  const updatePageBasedOnCursorPosition = (cursorPosition) => {
    // 텍스트 입력 중 불필요한 페이지 변경을 방지하기 위한 디바운스 구현
    // 현재는 사용자의 명시적인 커서 이동(클릭, 화살표 키 등)에서만 호출됨
    
    // 전체 텍스트의 커서 위치가 몇 번째 페이지에 속하는지 계산
    let accumulatedLength = 0;
    let targetPage = 1;
    
    for (let i = 0; i < pageContents.length; i++) {
      // 각 페이지의 길이 계산 (줄바꿈 문자 고려)
      let pageLength = pageContents[i].length;
      if (i < pageContents.length - 1) {
        pageLength += 1; // 페이지 간 줄바꿈 문자 고려
      }
      
      if (cursorPosition <= accumulatedLength + pageLength) {
        targetPage = i + 1;
        break;
      }
      accumulatedLength += pageLength;
    }
    
    // 필요한 경우에만 페이지 변경
    if (targetPage !== currentPage && targetPage <= pageCount) {
      setCurrentPage(targetPage);
    }
  };

  // 줄 가이드 렌더링
  const renderLineGuides = () => {
    return Array.from({ length: LINES_PER_PAGE }, (_, i) => (
      <div
        key={`line-${currentPage}-${i}`}
        className="absolute left-0 right-0 h-px bg-blue-200"
        style={{ top: `${(i + 1) * LINE_HEIGHT}px` }}
      />
    ));
  };

  // 페이지 번호 렌더링
  const renderPageNumbers = () => {
    return Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
      <button
        key={`page-btn-${pageNum}`}
        onClick={() => changePage(pageNum)}
        className={`mx-1 px-3 py-1 rounded ${pageNum === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
      >
        {pageNum}
      </button>
    ));
  };

  // 현재 페이지 렌더링
  const renderCurrentPage = () => {
    const currentPageContent = pageContents[currentPage - 1] || '';
    
    return (
      <div
        ref={paperRef}
        className="mb-4 bg-white border border-gray-300 rounded-lg shadow-lg p-8 relative w-full"
      >
        {/* 줄 가이드 영역 */}
        <div className="relative" style={{ height: `${PAGE_HEIGHT}px`, overflow: 'hidden' }}>
          {/* 줄 가이드 */}
          {renderLineGuides()}

          {/* 줄 번호 */}
          <div className="absolute left-[-20px] top-0">
            {Array.from({ length: LINES_PER_PAGE }, (_, i) => (
              <div
                key={`num-${currentPage}-${i}`}
                className="text-sm text-gray-400"
                style={{ height: `${LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
              >
                {(currentPage - 1) * LINES_PER_PAGE + i + 1}
              </div>
            ))}
          </div>

          {/* 텍스트 표시 영역 */}
          <div
            className="absolute top-0 left-0 right-0 font-serif text-lg text-gray-800 pointer-events-none"
            style={{
              lineHeight: `${LINE_HEIGHT}px`,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflow: 'hidden',
              height: `${PAGE_HEIGHT}px`
            }}
          >
            {currentPageContent}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center py-8 bg-amber-50 min-h-screen w-full">
      <h1 className="text-3xl font-serif mb-8 text-gray-800">편지지</h1>

      {/* 숨겨진 편집 영역 */}
      <div
        className="fixed top-0 left-0 opacity-0 pointer-events-none"
        style={{ width: '100%', height: 0 }}
      >
        <textarea
          ref={editorRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onMouseUp={() => {
            if (editorRef.current) {
              // 마우스로 위치 변경 시 해당 페이지로 이동
              updatePageBasedOnCursorPosition(editorRef.current.selectionStart);
            }
          }}
          onBlur={() => {
            // 에디터가 포커스를 잃을 때 커서 위치에 맞게 페이지 업데이트
            if (editorRef.current) {
              updatePageBasedOnCursorPosition(editorRef.current.selectionStart);
            }
          }}
          style={{
            width: '100%',
            lineHeight: `${LINE_HEIGHT}px`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            caretColor: 'black'
          }}
          placeholder='여기에 텍스트를 입력하세요'
        />

        {/* 텍스트 높이 측정용 숨겨진 요소 */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '600px', // 대략적인 편지지 너비
            lineHeight: `${LINE_HEIGHT}px`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            visibility: 'hidden'
          }}
        />
      </div>

      {/* 현재 페이지만 표시하는 컨테이너 */}
      <div className="w-full max-w-3xl px-4 min-h-[300px]" onClick={() => editorRef.current?.focus()}>
        {renderCurrentPage()}
      </div>

      {/* 페이지 내비게이션 */}
      <div className="mb-8 flex flex-wrap justify-center mt-4">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          이전
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= pageCount}
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default TestLetter;