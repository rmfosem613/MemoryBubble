import React, { useEffect, useRef, useState } from 'react';
import '@/components/introduce/scrollAnimation.css'; // 스크롤 스타일 import

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

  const textRef = useRef(null);
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

  // 텍스트 오버레이 효과를 위한 코드
  useEffect(() => {
    if (!textRef.current || !imageAreaRef.current) return;

    // 텍스트 영역 내의 각 문자를 개별 span으로 분리하는 함수
    const splitTextIntoSpans = () => {
      const textElement = textRef.current;
      const originalText = textElement.innerText;
      let newHtml = '';

      // 각 문자를 span으로 감싸기
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === '\n') {
          newHtml += '<br/>';
        } else if (originalText[i] === ' ') {
          newHtml += '<span class="text-char">&nbsp;</span>';
        } else {
          newHtml += `<span class="text-char">${originalText[i]}</span>`;
        }
      }

      textElement.innerHTML = newHtml;
      return textElement.querySelectorAll('.text-char');
    };

    // 초기 span 분리
    const charSpans = splitTextIntoSpans();

    // 오버레이 감지와 업데이트 함수
    const updateOverlayEffect = () => {
      const imageRect = imageAreaRef.current.getBoundingClientRect();

      charSpans.forEach(span => {
        const spanRect = span.getBoundingClientRect();

        // 이미지 영역과 텍스트 영역의 겹침 여부 확인
        const isOverlapping = !(
          spanRect.right < imageRect.left ||
          spanRect.left > imageRect.right ||
          spanRect.bottom < imageRect.top ||
          spanRect.top > imageRect.bottom
        );

        // 겹치는 부분은 검은색, 겹치지 않는 부분은 하얀색으로 설정
        if (isOverlapping) {
          span.style.color = 'white';
        } else {
          span.style.color = 'black';
        }
      });
    };

    // 초기 업데이트
    updateOverlayEffect();

    // 스크롤 및 리사이즈 이벤트에서 업데이트
    const handleUpdate = () => {
      requestAnimationFrame(updateOverlayEffect);
    };

    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    // 이미지 영역이 애니메이션될 경우 지속적으로 업데이트
    const animationInterval = setInterval(handleUpdate, 50);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <>
      <div className='flex h-screen relative overflow-hidden'>
        {/* 콘텐츠 영역 */}
        <div className='container pt-[60px]'>
          {/* 이미지 스크롤 영역 */}
          <div className='flex h-full w-full'>
            <div className='fixed -right-[40px] -bottom-[350px]' ref={imageAreaRef}>
              <div className='w-[1000px] h-[1000px] flex justify-center'>
                <div className='flex space-x-3 rotate-6 rounded-full overflow-hidden justify-between'>

                  {/* 첫 번째 ul - 위로 스크롤 */}
                  <div className='scroll-container w-[25%] overflow-hidden'>
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
                  <div className='scroll-container w-[25%] overflow-hidden'>
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
                  <div className='scroll-container w-[25%] overflow-hidden'>
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
                  <div className='scroll-container w-[25%] overflow-hidden'>
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
                  <div className='scroll-container w-[25%] overflow-hidden'>
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
                </div>
              </div>
            </div>
          </div>

          {/* 글자 영역 */}
          <div className='fixed bottom-10 left-10 z-10'>
            <p
              ref={textRef}
              className='font-p-800 text-[75px]'
              style={{
                lineHeight: "90px",
                WebkitTextStroke: '1px black',
              }}
            >
              소중한 추억을 간직하는 공간, <br />
              추억방울과 함께하세요
            </p>
          </div>
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