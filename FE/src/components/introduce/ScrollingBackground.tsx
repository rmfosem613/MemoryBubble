import React from 'react';
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

import fam1 from '@/assets/intro/fam1.png'
import fam2 from '@/assets/intro/fam2.png'
import fam3 from '@/assets/intro/fam3.png'
import fam4 from '@/assets/intro/fam4.png'
import fam5 from '@/assets/intro/fam5.png'
import fam6 from '@/assets/intro/fam6.png'
import fam7 from '@/assets/intro/fam7.png'
import fam8 from '@/assets/intro/fam8.png'
import fam9 from '@/assets/intro/fam9.png'
import fam10 from '@/assets/intro/fam10.png'
import fam11 from '@/assets/intro/fam11.png'
import fam12 from '@/assets/intro/fam12.png'
import fam13 from '@/assets/intro/fam13.png'
import fam14 from '@/assets/intro/fam14.png'

const ScrollingBackground = () => {
  return (
    <div className='absolute top-0 left-0 w-full z-5'>
      <div className='flex space-x-4 justify-between'>
        {/* 첫 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              <img src={pic1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic2} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic3} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={pic1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic2} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic3} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
          </ul>
        </div>

        {/* 두 번째 ul - 아래로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-down w-full'>
            <li className='h-[30%] py-2'>
              <img src={pic1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic10} className='h-full w-full rounded-[10px] object-cover' alt="Image 10" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic2} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={pic1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic10} className='h-full w-full rounded-[10px] object-cover' alt="Image 10" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic2} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
          </ul>
        </div>

        {/* 세 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              <img src={pic4} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic6} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic9} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic3} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={pic4} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic6} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic9} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic3} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
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
              <img src={pic7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic5} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam13} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam14} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={pic5} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
          </ul>
        </div>

        {/* 다섯 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam2} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam3} className='h-full w-full rounded-[10px] object-cover' alt="Image 10" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam4} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam1} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam2} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam3} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam4} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
          </ul>
        </div>

        {/* 여섯 번째 ul - 위로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-down w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam5} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam6} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam8} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam5} className='h-full w-full rounded-[10px] object-cover' alt="Image 5" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam6} className='h-full w-full rounded-[10px] object-cover' alt="Image 6" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam7} className='h-full w-full rounded-[10px] object-cover' alt="Image 7" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam8} className='h-full w-full rounded-[10px] object-cover' alt="Image 9" />
            </li>
          </ul>
        </div>

        {/* 일곱 번째 ul - 아래로 스크롤 */}
        <div className='scroll-container w-[25%] rotate-6'>
          <ul className='scroll-up w-full'>
            <li className='h-[30%] py-2'>
              <img src={fam9} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam10} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam11} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam12} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
            {/* 복제된 요소들 (무한 스크롤용) */}
            <li className='h-[30%] py-2'>
              <img src={fam9} className='h-full w-full rounded-[10px] object-cover' alt="Image 1" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam10} className='h-full w-full rounded-[10px] object-cover' alt="Image 2" />
            </li>
            <li className='h-[30%] py-2'>
              <img src={fam11} className='h-full w-full rounded-[10px] object-cover' alt="Image 3" />
            </li>
            <li className='h-[30%] w-[30%] py-2'>
              <img src={fam12} className='h-full w-full rounded-[10px] object-cover' alt="Image 4" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScrollingBackground;