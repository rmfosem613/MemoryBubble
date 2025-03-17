import { useRef, useEffect } from 'react';
import { useLetterStore } from '@/stores/useLetterStore';
import { MAX_CHARS_PER_LINE } from '@/utils/letterUtils';

export const useLetterInput = () => {
  const {
    pages,
    currentPage,
    setPages,
    setCurrentPage,
    updateLine,
    addPage,
    updatePagePrevious,
    clearPrevious,
    letterType // letterType 상태 가져오기
  } = useLetterStore();
  
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const handleLineChange = (lineIndex: number, value: string) => {
    // letterType이 'cassette'인 경우 함수 실행 중단
    if (letterType === 'cassette') return;

    // 입력이 최대 길이를 초과하면 오버플로우 처리
    if (value.length > MAX_CHARS_PER_LINE) {
      const currentLine = value.slice(0, MAX_CHARS_PER_LINE);
      const overflow = value.slice(MAX_CHARS_PER_LINE);

      // 현재 라인 업데이트
      updateLine(currentPage, lineIndex, currentLine);

      // 가능한 경우 오버플로우를 다음 라인으로 이동
      if (lineIndex < 8) {
        // 다음 라인 앞에 오버플로우 추가
        const nextLineText = pages[currentPage].lines[lineIndex + 1];
        updateLine(currentPage, lineIndex + 1, overflow + nextLineText);

        // 다음 라인으로 포커스 이동
        setTimeout(() => {
          textareaRefs.current[lineIndex + 1]?.focus();
          // 다음 라인의 시작 부분에 커서 위치 설정
          if (textareaRefs.current[lineIndex + 1]) {
            textareaRefs.current[lineIndex + 1]!.selectionStart = overflow.length;
            textareaRefs.current[lineIndex + 1]!.selectionEnd = overflow.length;
          }
        }, 0);
      }
      // 마지막 라인인 경우, 다음 페이지로 이동
      else if (lineIndex === 8) {
        handlePageOverflow(overflow);
      }
    } else {
      // 일반 경우: 오버플로우 없이 현재 라인 업데이트
      updateLine(currentPage, lineIndex, value);
    }
  };

  // 마지막 라인에서 새 페이지로의 오버플로우 처리
  const handlePageOverflow = (overflow: string) => {
    // letterType이 'cassette'인 경우 함수 실행 중단
    if (letterType === 'cassette') return;

    const lineContent = pages[currentPage].lines[8].substring(0, MAX_CHARS_PER_LINE);

    // 한 줄에 글자 제한을 초과하는 부분만 previous로 저장
    const overflowContent = lineContent.length > MAX_CHARS_PER_LINE
      ? lineContent.substring(MAX_CHARS_PER_LINE)
      : overflow;

    // 새 페이지 생성 또는 기존 다음 페이지 사용
    if (currentPage === pages.length - 1) {
      // 마지막 페이지인 경우 새 페이지 추가
      addPage({
        lines: [overflow, '', '', '', '', '', '', '', ''],
        previous: overflowContent
      });
    } else {
      // 기존 다음 페이지가 있는 경우
      // 다음 페이지의 기존 내용을 저장
      const nextPageData = JSON.parse(JSON.stringify(pages[currentPage + 1]));

      // unshift 방식으로 컨텐츠 추가
      const shiftedLines = [...nextPageData.lines];
      shiftedLines.unshift(overflow); // 맨 앞에 새 내용 추가
      shiftedLines.pop(); // 마지막 항목 제거

      // 새 페이지 데이터 구성
      const updatedPages = [...pages];
      updatedPages[currentPage + 1] = {
        ...nextPageData,
        lines: shiftedLines,
        previous: overflowContent
      };

      // 상태 업데이트
      setPages(updatedPages);

      // previous 값 1초 후 초기화
      setTimeout(() => {
        clearPrevious(currentPage + 1);
      }, 1000);
    }

    // 페이지 전환
    setCurrentPage(currentPage + 1);

    // 다음 페이지의 첫 줄에 포커스
    setTimeout(() => {
      textareaRefs.current[0]?.focus();
      // 커서 위치 설정
      if (textareaRefs.current[0]) {
        textareaRefs.current[0]!.selectionStart = overflow.length;
        textareaRefs.current[0]!.selectionEnd = overflow.length;
      }
    }, 0);
  };

  // 라인 간 네비게이션을 위한 키 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent, lineIndex: number) => {
    // letterType이 'cassette'인 경우 함수 실행 중단
    if (letterType === 'cassette') return;

    if (e.key === 'Enter') {
      e.preventDefault();

      // 마지막 라인이 아닌 경우 다음 라인으로 이동
      if (lineIndex < 8) {
        textareaRefs.current[lineIndex + 1]?.focus();
      }
      // 마지막 라인인 경우 다음 페이지의 첫 번째 라인으로 이동
      else if (lineIndex === 8) {
        // 마지막 페이지인 경우 새 페이지 추가
        if (currentPage === pages.length - 1) {
          addPage({
            lines: ['', '', '', '', '', '', '', '', ''],
            previous: ''
          });

          // 페이지 전환
          setCurrentPage(currentPage + 1);

          // 다음 페이지의 첫 줄에 포커스
          setTimeout(() => {
            textareaRefs.current[0]?.focus();
          }, 0);
        } else {
          // 기존 다음 페이지의 내용을 한 줄씩 아래로 이동
          const nextPageData = JSON.parse(JSON.stringify(pages[currentPage + 1]));

          // 모든 줄을 한 칸씩 아래로 이동 (마지막 줄은 버림)
          const shiftedLines = ['', ...nextPageData.lines.slice(0, 8)];

          // 새 페이지 데이터 구성
          const updatedPages = [...pages];
          updatedPages[currentPage + 1] = {
            ...nextPageData,
            lines: shiftedLines
          };

          // 상태 업데이트
          setPages(updatedPages);

          // 페이지 전환
          setCurrentPage(currentPage + 1);

          // 다음 페이지의 첫 줄에 포커스
          setTimeout(() => {
            textareaRefs.current[0]?.focus();
          }, 0);
        }
      }
    } else if (e.key === 'ArrowUp' && lineIndex > 0) {
      textareaRefs.current[lineIndex - 1]?.focus();
    } else if (e.key === 'ArrowDown' && lineIndex < 8) {
      textareaRefs.current[lineIndex + 1]?.focus();
    }
  };

  // 페이지 간 네비게이션
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    // 카세트 편지 타입에서는 페이지 추가 필요 없음
    if (letterType === 'cassette') {
      return;
    }

    // 마지막 페이지인 경우 새 페이지 추가
    if (currentPage === pages.length - 1) {
      addPage({
        lines: ['', '', '', '', '', '', '', '', ''],
        previous: ''
      });
    }

    // 단순히 페이지만 전환 (콘텐츠 변경 없음)
    setCurrentPage(currentPage + 1);

    // 다음 페이지의 첫 줄에 포커스
    setTimeout(() => {
      textareaRefs.current[0]?.focus();
    }, 0);
  };

  // 클릭 이벤트 발생 시 previous 초기화 처리
  const handleClick = () => {
    // letterType이 'cassette'인 경우 함수 실행 중단
    if (letterType === 'cassette') return;

    // previous 값 초기화
    if (pages[currentPage].previous) {
      clearPrevious(currentPage);
    }
  };

  // 페이지 변경 시 참조 배열 설정
  useEffect(() => {
    // letterType이 'text'인 경우에만 textareaRefs 설정
    if (letterType === 'text') {
      textareaRefs.current = textareaRefs.current.slice(0, 9);
    }
  }, [currentPage, letterType]);

  return {
    textareaRefs,
    handleLineChange,
    handleKeyDown,
    goToPreviousPage,
    goToNextPage,
    handleClick
  };
};