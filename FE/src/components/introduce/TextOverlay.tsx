import React from 'react';

interface TextOverlayProps {
  textContainerRef: React.RefObject<HTMLDivElement>;
}

const TextOverlay: React.FC<TextOverlayProps> = ({ textContainerRef }) => {
  return (
    <div className='fixed bottom-10 left-10 z-30 select-none' ref={textContainerRef}>
      <div className="relative">
        {/* 기본 텍스트 (검은색) - 항상 보이는 텍스트 */}
        <p
          className='font-p-800 text-[75px]'
          style={{
            lineHeight: "90px",
            WebkitTextStroke: '1px black',
            color: 'black',
          }}
        >
          소중한 추억을 간직하는 공간, <br />
          추억방울과 함께하세요
        </p>

        {/* 클리핑 마스크로 작동할 이미지 영역 참조 요소 */}
        <div
          className='absolute top-0 left-0 w-full h-full pointer-events-none'
          style={{
            clipPath: 'url(#textMask)',
            WebkitClipPath: 'url(#textMask)',
          }}
        >
          {/* 이미지와 겹치는 영역에만 보일 흰색 텍스트 */}
          <p
            className='font-p-800 text-[75px]'
            style={{
              lineHeight: "90px",
              WebkitTextStroke: '1px black',
              color: 'white',
            }}
          >
            소중한 추억을 간직하는 공간, <br />
            추억방울과 함께하세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextOverlay;