import React, { useEffect, useRef } from 'react';

interface TelescopeViewProps {
  telescopeSize: number;
  imageAreaRef: React.RefObject<HTMLDivElement>;
  textContainerRef: React.RefObject<HTMLDivElement>;
}

const ClipingView: React.FC<TelescopeViewProps> = ({ telescopeSize, imageAreaRef, textContainerRef }) => {
  return (
    <>
      {/* 망원경으로 볼 수 있는 원형 영역 - 스크롤에 따라 크기가 변함 */}
      <div
        ref={imageAreaRef}
        className='fixed z-20 right-0 bottom-0 rounded-full telescope-expanding'
        style={{
          width: `${telescopeSize}px`,
          height: `${telescopeSize}px`,
          right: '-160px',  // 중앙에 위치
          bottom: '-370px', // 중앙에 위치
          boxShadow: '0 0 0 2000px rgba(255, 255, 255, 1)', // 주변에 반투명 오버레이 추가
        }}
      />

      {/* SVG 클리핑 마스크 정의 - 망원경 크기에 따라 업데이트 */}
      <svg className="absolute" style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          {/* 텍스트 마스크 - 텍스트가 망원경 영역과 겹칠 때 색상 변경 (원형으로 수정) */}
          <clipPath id="textMask" clipPathUnits="objectBoundingBox">
            <path ref={path => {
              if (path && imageAreaRef.current && textContainerRef.current) {
                // 컴포넌트 마운트 및 망원경 크기 변경 시 클리핑 패스 동적 업데이트
                const updateClipPath = () => {
                  const imageRect = imageAreaRef.current.getBoundingClientRect();
                  const textRect = textContainerRef.current.getBoundingClientRect();

                  // 텍스트 기준으로 상대적인 위치 계산
                  const centerX = (imageRect.left + imageRect.width / 2 - textRect.left) / textRect.width;
                  const centerY = (imageRect.top + imageRect.height / 2 - textRect.top) / textRect.height;

                  // 원의 반지름 계산 (텍스트 컨테이너의 너비와 높이에 비례)
                  const radiusX = (imageRect.width / 2) / textRect.width;
                  const radiusY = (imageRect.height / 2) / textRect.height;

                  // SVG 타원 경로로 클리핑 패스 업데이트 (원형 마스크)
                  const d = `
                    M ${centerX} ${centerY - radiusY}
                    A ${radiusX} ${radiusY} 0 0 1 ${centerX + radiusX} ${centerY}
                    A ${radiusX} ${radiusY} 0 0 1 ${centerX} ${centerY + radiusY}
                    A ${radiusX} ${radiusY} 0 0 1 ${centerX - radiusX} ${centerY}
                    A ${radiusX} ${radiusY} 0 0 1 ${centerX} ${centerY - radiusY}
                    Z
                  `;

                  path.setAttribute('d', d);
                };

                updateClipPath();

                // 이벤트 리스너 등록
                window.addEventListener('scroll', updateClipPath);
                window.addEventListener('resize', updateClipPath);

                // 망원경 크기 변화를 감지하기 위한 observer 설정
                const observer = new ResizeObserver(updateClipPath);
                observer.observe(imageAreaRef.current);

                // 클린업
                return () => {
                  window.removeEventListener('scroll', updateClipPath);
                  window.removeEventListener('resize', updateClipPath);
                  observer.disconnect();
                };
              }
            }} />
          </clipPath>
        </defs>
      </svg>

      {/* 배경 이미지를 망원경 영역과 동일하게 마스킹하는 SVG 클리핑 패스 */}
      <svg className="absolute" style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <clipPath id="backgroundMask" clipPathUnits="userSpaceOnUse">
            <circle
              ref={circle => {
                if (circle && imageAreaRef.current) {
                  const updateMask = () => {
                    const imageRect = imageAreaRef.current.getBoundingClientRect();
                    // 원의 중심과 반지름 설정
                    circle.setAttribute('cx', String(imageRect.left + imageRect.width / 2));
                    circle.setAttribute('cy', String(imageRect.top + imageRect.height / 2));
                    circle.setAttribute('r', String(imageRect.width / 2));
                  };

                  updateMask();
                  window.addEventListener('scroll', updateMask);
                  window.addEventListener('resize', updateMask);

                  // 망원경 크기 변화를 감지하기 위한 observer 설정
                  const observer = new ResizeObserver(updateMask);
                  observer.observe(imageAreaRef.current);

                  return () => {
                    window.removeEventListener('scroll', updateMask);
                    window.removeEventListener('resize', updateMask);
                    observer.disconnect();
                  };
                }
              }}
            />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default ClipingView;