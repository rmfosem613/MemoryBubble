import { ColorTheme } from '@/types/Letter';

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

interface SeasonTemplateProps {
  selectedColor?: ColorTheme;
}

/**
 * 계절별 이미지 장식을 렌더링하는 컴포넌트
 */
function SeasonalTemplate({ selectedColor }: SeasonTemplateProps) {
  switch (selectedColor) {
    case 'spring':
      return (
        <>
          <img src={cherry} className="absolute top-[10px] right-[10px] z-0 w-[110px] lg:w-[130px] md:w-[120px] select-none" />
          <img src={sweet} className="absolute bottom-0 left-0 z-0 w-[140px] lg:w-[160px] md:w-[150px] select-none" />
        </>
      );
    case 'summer':
      return (
        <>
          <img src={seashell} className="absolute top-[10px] left-[10px] z-0 w-[90px] lg:w-[110px] md:w-[110px] select-none" />
          <img src={turtle} className="absolute bottom-[0px] right-[10px] z-0 w-[180px] lg:w-[200px] md:w-[190px] select-none" />
        </>
      );
    case 'autumn':
      return (
        <>
          <img src={plant} className="absolute bottom-0 left-0 z-0 w-[140px] lg:w-[160px] md:w-[150px] select-none" />
          <img src={tree} className="absolute bottom-[-10px] right-[-8px] z-0 w-[250px] lg:w-[270px] md:w-[260px] select-none" />
        </>
      );
    case 'winter':
    default:
      return (
        <>
          <img src={snow} className="absolute bottom-[-70px] left-[-60px] z-0 w-[300px] lg:w-[350px] md:w-[320px] select-none" />
          <img src={snowman} className="absolute bottom-[-30px] right-[10px] z-0 w-[200px] lg:w-[250px] md:w-[230px] select-none" />
        </>
      );
  }
}

export default SeasonalTemplate;