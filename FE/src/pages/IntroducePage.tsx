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
        <div className='container pt-[60px]'>
          {/* 이미지 스크롤 영역 */}
          <div className='flex h-full w-full'>
            <div className='fixed -right-[40px] -bottom-[350px]'>
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
              className='font-p-800 text-[75px] text-white'
              style={{
                lineHeight: "90px",
                WebkitTextStroke: '1px black',
                mixBlendMode: 'difference',
                color: 'white'
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