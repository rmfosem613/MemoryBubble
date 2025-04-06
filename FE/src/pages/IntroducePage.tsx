import React, { useEffect, useRef, useState } from 'react';
import '@/components/introduce/scrollAnimation.css';

import pic1 from '@/assets/intro/1.png'
import pic2 from '@/assets/intro/2.png'
import pic3 from '@/assets/intro/3.png'
import pic4 from '@/assets/intro/4.png'
import pic5 from '@/assets/intro/5.png'
import pic6 from '@/assets/intro/6.png'
import pic7 from '@/assets/intro/7.png'
import pic9 from '@/assets/intro/9.png'
import pic10 from '@/assets/intro/10.png'

function IntroducePage() {
  const [curtainHeight, setCurtainHeight] = useState(100);
  const textContainerRef = useRef(null);
  const imageAreaRef = useRef(null);

  useEffect(() => {
    // 페이지가 로드되면 약간의 지연 후 커튼을 아래로 사라지게 함
    const timer = setTimeout(() => {
      // 애니메이션 효과를 위해 점진적으로 커튼 높이를 줄임
      const animateCurtain = () => {
        setCurtainHeight(prev => {
          if (prev <= 0) return 0;
          return prev - 30; // 줄여나감
        });
      };

      const animation = setInterval(animateCurtain, 10); // 10ms마다 실행

      // 애니메이션이 완료되면 interval 정리
      const cleanup = setTimeout(() => {
        clearInterval(animation);
      }, 1200); // 대략 2초 정도 소요

      return () => {
        clearInterval(animation);
        clearTimeout(cleanup);
      };
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className='flex h-screen relative overflow-hidden'>
        {/* 콘텐츠 영역 */}
        <div className='pt-[60px]'>
          {/* 전체 화면을 덮는 오버레이 - 하얀색 배경 */}
          <div className='fixed top-0 left-0 w-full h-screen bg-white z-10'></div>

          {/* 망원경으로 볼 수 있는 단일 원형 영역 */}
          <div
            ref={imageAreaRef}
            className='fixed z-20 rounded-full overflow-hidden bg-gray-800'
            style={{
              width: '1000px',
              height: '1000px',
              top: '80%',
              left: '70%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* 스크롤 이미지 영역 - 원형 안에만 표시됨 */}
            <div className='absolute top-0 -left-[500px] w-[calc(100%+800px)]'>
              <div className='flex space-x-3 justify-between'>
                {/* 첫 번째 ul - 위로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-up w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic2} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic2} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>

                {/* 두 번째 ul - 아래로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-down w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic5} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic6} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic5} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic6} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>

                {/* 세 번째 ul - 위로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-up w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic7} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic9} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic10} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic7} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic7} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic9} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic10} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic7} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>

                {/* 네 번째 ul - 아래로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-down w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic9} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic9} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>

                {/* 다섯 번째 ul - 위로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-up w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic9} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic9} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>

                {/* 여섯 번째 ul - 위로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-up w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic2} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic2} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic3} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic1} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>

                {/* 일곱 번째 ul - 아래로 스크롤 */}
                <div className='scroll-container w-[25%] overflow-hidden rotate-6'>
                  <ul className='scroll-down w-full'>
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic5} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic6} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    {/* 복제된 요소들 (무한 스크롤용) */}
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic5} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic6} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                    <li className='h-[30%] py-2'>
                      <img src={pic4} className='h-full w-full rounded-[10px] object-cover' />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 글자 영역 - 수정된 부분 */}
          <div className='fixed bottom-10 left-10 z-30' ref={textContainerRef}>
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

          {/* SVG 클리핑 마스크 정의 */}
          <svg className="absolute" style={{ width: 0, height: 0, position: 'absolute' }}>
            <defs>
              {/* 텍스트 마스크 - 텍스트가 망원경 영역과 겹칠 때 색상 변경 (원형으로 수정) */}
              <clipPath id="textMask" clipPathUnits="objectBoundingBox">
                <path ref={path => {
                  if (path && imageAreaRef.current) {
                    // 컴포넌트 마운트 후 이미지 영역의 위치를 기반으로 클리핑 패스 동적 업데이트
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
                      // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
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
                    window.addEventListener('scroll', updateClipPath);
                    window.addEventListener('resize', updateClipPath);

                    // 애니메이션 동기화
                    const interval = setInterval(updateClipPath, 16);

                    // 클린업
                    return () => {
                      window.removeEventListener('scroll', updateClipPath);
                      window.removeEventListener('resize', updateClipPath);
                      clearInterval(interval);
                    };
                  }
                }} />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* 검은색 커튼 - 위에서 아래로 사라짐 */}
        <div
          className='absolute top-0 left-0 right-0 bg-black z-50 transition-height ease-out'
          style={{
            height: `${curtainHeight}%`,
            transition: 'height 0.5s ease-out'
          }}
        ></div>
      </div>
    </>
  );
}

export default IntroducePage;