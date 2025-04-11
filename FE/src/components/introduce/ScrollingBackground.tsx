import React from 'react';
import '@/components/introduce/scrollAnimation.css';

import fam1 from '@/assets/intro/fam1.webp'
import fam2 from '@/assets/intro/fam2.webp'
import fam3 from '@/assets/intro/fam3.webp'
import fam4 from '@/assets/intro/fam4.webp'
import fam5 from '@/assets/intro/fam5.webp'
import fam6 from '@/assets/intro/fam6.webp'
import fam7 from '@/assets/intro/fam7.webp'
import fam8 from '@/assets/intro/fam8.webp'
import fam9 from '@/assets/intro/fam9.webp'
import fam10 from '@/assets/intro/fam10.webp'
import fam11 from '@/assets/intro/fam11.webp'
import fam12 from '@/assets/intro/fam12.webp'
import fam13 from '@/assets/intro/fam13.webp'
import fam14 from '@/assets/intro/fam14.webp'
import fam15 from '@/assets/intro/fam15.webp'
import fam16 from '@/assets/intro/fam16.webp'
import fam17 from '@/assets/intro/fam17.webp'
import fam18 from '@/assets/intro/fam18.webp'
import fam19 from '@/assets/intro/fam19.webp'
import fam20 from '@/assets/intro/fam20.webp'
import fam21 from '@/assets/intro/fam21.webp'
import fam22 from '@/assets/intro/fam22.webp'
import fam23 from '@/assets/intro/fam23.webp'

const ScrollingBackground = () => {
  return (
    <div className='absolute top-0 left-0 w-full z-5'>
      <div className='flex space-x-4 justify-between'>
        {/* 첫 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam21} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam23} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam19} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam21} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam21} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam23} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam19} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam21} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
          </ul>
        </div>

        {/* 두 번째 ul - 아래로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-down w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam21} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam22} className='h-full w-full rounded-[10px] object-cover' alt="Image 10" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam23} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam15} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam21} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam22} className='h-full w-full rounded-[10px] object-cover' alt="Image 10" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam23} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam15} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
          </ul>
        </div>

        {/* 세 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam18} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam17} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam20} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam19} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam18} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam17} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam20} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam19} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
          </ul>
        </div>

        {/* 네 번째 ul - 아래로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-down w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam13} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam14} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam15} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam16} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam13} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam14} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam15} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam16} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
          </ul>
        </div>

        {/* 다섯 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              {/* <img src={fam1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" /> */}
              <picture>
                <source srcSet={fam1} type="image/webp" />
                <img src={fam1.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam2} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" /> */}
              <picture>
                <source srcSet={fam2} type="image/webp" />
                <img src={fam2.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam3} className='h-full w-full rounded-[10px] object-cover' alt="Image 10" /> */}
              <picture>
                <source srcSet={fam3} type="image/webp" />
                <img src={fam3.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam4} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" /> */}
              <picture>
                <source srcSet={fam4} type="image/webp" />
                <img src={fam4.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              {/* <img src={fam1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" /> */}
              <picture>
                <source srcSet={fam1} type="image/webp" />
                <img src={fam1.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam2} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" /> */}
              <picture>
                <source srcSet={fam2} type="image/webp" />
                <img src={fam2.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam3} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" /> */}
              <picture>
                <source srcSet={fam3} type="image/webp" />
                <img src={fam3.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam4} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" /> */}
              <picture>
                <source srcSet={fam4} type="image/webp" />
                <img src={fam4.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
          </ul>
        </div>

        {/* 여섯 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-down w-full'>
            <li className='h-[30%] py-2'>
              {/* <img src={fam5} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" /> */}
              <picture>
                <source srcSet={fam5} type="image/webp" />
                <img src={fam5.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam6} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" /> */}
              <picture>
                <source srcSet={fam6} type="image/webp" />
                <img src={fam6.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" /> */}
              <picture>
                <source srcSet={fam7} type="image/webp" />
                <img src={fam7.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam8} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" /> */}
              <picture>
                <source srcSet={fam8} type="image/webp" />
                <img src={fam8.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              {/* <img src={fam5} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" /> */}
              <picture>
                <source srcSet={fam5} type="image/webp" />
                <img src={fam5.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam6} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" /> */}
              <picture>
                <source srcSet={fam6} type="image/webp" />
                <img src={fam6.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" /> */}
              <picture>
                <source srcSet={fam7} type="image/webp" />
                <img src={fam7.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam8} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" /> */}
              <picture>
                <source srcSet={fam8} type="image/webp" />
                <img src={fam8.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
          </ul>
        </div>

        {/* 일곱 번째 ul - 아래로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              {/* <img src={fam9} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" /> */}
              <picture>
                <source srcSet={fam9} type="image/webp" />
                <img src={fam9.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam10} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" /> */}
              <picture>
                <source srcSet={fam10} type="image/webp" />
                <img src={fam10.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam11} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" /> */}
              <picture>
                <source srcSet={fam11} type="image/webp" />
                <img src={fam11.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam12} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" /> */}
              <picture>
                <source srcSet={fam12} type="image/webp" />
                <img src={fam12.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              {/* <img src={fam9} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" /> */}

              <picture>
                <source srcSet={fam9} type="image/webp" />
                <img src={fam9.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam10} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" /> */}
              <picture>
                <source srcSet={fam10} type="image/webp" />
                <img src={fam10.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] py-2'>
              {/* <img src={fam11} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" /> */}
              <picture>
                <source srcSet={fam11} type="image/webp" />
                <img src={fam11.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
            <li className='h-[30%] w-[30%] py-2'>
              {/* <img src={fam12} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" /> */}
              <picture>
                <source srcSet={fam12} type="image/webp" />
                <img src={fam12.replace('.webp', '.png')} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
              </picture>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScrollingBackground;