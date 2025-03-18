// 이미지 import
// summer
import turtle from '@/assets/letter/summer-turtle.svg';
import seashell from '@/assets/letter/summer-seashell.svg';

// spring
import cherry from '@/assets/letter/spring-cherry.svg';
import sweet from '@/assets/letter/sping-sweet.svg';

// autumn
import plant from '@/assets/letter/autumn-plant.svg';
import tree from '@/assets/letter/autumn-tree.svg';

//winter
import snow from '@/assets/letter/winter-snow.svg';
import snowman from '@/assets/letter/winter-snowman.svg';

import { useLetterStore } from '@/stores/useLetterStore';

function LetterContent() {
  const { selectedColor } = useLetterStore();

  // 계절별 이미지 설정 (위치, 크기 등 포함)
  const getSeasonalImages = () => {
    switch (selectedColor) {
      case 'spring':
        return (
          <>
            <img src={cherry} className="absolute top-[10px] right-[10px] z-0 w-[110px] lg:w-[130px] md:w-[120px]" />
            <img src={sweet} className="absolute bottom-0 left-0 z-0 w-[140px] lg:w-[160px] md:w-[150px]" />
          </>
        );
      case 'summer':
        return (
          <>
            <img src={seashell} className="absolute top-[10px] left-[10px] z-0 w-[90px] lg:w-[110px] md:w-[110px]" />
            <img src={turtle} className="absolute bottom-[0px] right-[10px] z-0 w-[180px] lg:w-[200px] md:w-[190px]" />
          </>
        );
      case 'autumn':
        return (
          <>
            <img src={plant} className="absolute bottom-0 left-0 z-0 w-[140px] lg:w-[160px] md:w-[150px]" />
            <img src={tree} className="absolute bottom-0 right-0 z-0 w-[250px] lg:w-[270px] md:w-[260px]" />
          </>
        );
      case 'winter':
      default:
        return (
          <>
            <img src={snow} className="absolute bottom-[-70px] left-[-60px] z-0 w-[300px] lg:w-[350px] md:w-[320px]" />
            <img src={snowman} className="absolute bottom-[-30px] right-[10px] z-0 w-[200px] lg:w-[250px] md:w-[230px]" />
          </>
        );
    }
  };

  return (
    <div className="relative border-2 border-gray-300 rounded-[8px] p-5 overflow-hidden">
      {/* 편지지 데코레이션: z-0 */}
      {getSeasonalImages()}

      <div className="relative z-10 h-full flex flex-col">
        <div>
          <div className="flex space-x-3 relative z-20 items-end mb-[9px]">
            <p className="text-h3-lg font-p-700">TO.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">사랑스런 큰딸</p>
          </div>
        </div>

        {/* 편지지 줄 7개 추가 */}
        {[...Array(7)].map((_, index) => (
          <div key={index}>
            {/* border-t : 굵기 0.5px */}
            <hr className="border-t border-gray-400 my-[26.7px]" />
          </div>
        ))}

        <div>
          <div className="flex space-x-3 relative z-20 items-end mt-[-31px] justify-end">
            <p className="text-h3-lg font-p-700">From.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">엄마가</p>
          </div>
        </div>
      </div>

      {/* 편지지 내용 입력: z-30 */}
      <div className="absolute top-[-10px] mt-[60px] z-30 flex flex-col w-full pr-[40px]">
        <textarea
          className='resize-none h-[370px]'
          style={{ backgroundColor: 'transparent', lineHeight: '340%', outline: 'none' }}
          rows={9}
        />
      </div>
    </div>
  );
};

export default LetterContent;