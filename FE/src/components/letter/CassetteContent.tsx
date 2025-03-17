import Cassette from '@/assets/letter/cassette-1.svg'
import CassetteReel from '@/assets/letter/cassette-reel.svg'

import { Circle, Headset } from 'lucide-react'

function CassetteContent() {
  return (
    <div className="border-2 border-gray-300 rounded-[8px] p-5 h-[95.5%] relative overflow-hidden w-[100%]">

      {/* 카세트 이미지 */}
      <div className='flex h-full w-full justify-center mt-[-50px]'>
        <img src={Cassette} className='relative z-10 w-[400px]' />
        <img src={CassetteReel} className='absolute w-[44px] mt-[182px] ml-[-161.6px] z-10 animate-spin-slow' />
        <img src={CassetteReel} className='absolute w-[44px] mt-[182px] ml-[161.3px] z-10 animate-spin-slow' />
      </div>

      {/* 카세트 흰 테이프 */}
      <div className='absolute z-20 flex justify-center top-0 h-full w-full'>
        <div className='absolute bg-white w-[120px] h-[20px] mt-[100px] ml-[-28px]' />
        <div className='absolute bg-white w-[120px] h-[20px] mt-[110px] ml-[-19px] ' />
      </div>

      {/* 카세트 보낸이 */}
      <div className='absolute z-20 flex w-full top-0 h-full justify-center mt-[14%]'>
        <p className='absolute font-h4 text-h4-lg ml-[-25px]'>From. 아빠</p>
        <p className='absolute text-gray-600 mt-[110px] ml-[200px] text-p-lg font-pretendard'>2024.03.17</p>
      </div>

      <div className='absolute z-20 top-0 h-full w-full flex justify-center'>
        <div className='absolute bottom-0 mb-[134px] ml-[-40px] h-[10px] w-[400px] bg-winter-100 rounded-full'></div>
        <div className='absolute bottom-0 mb-[134px] ml-[-390px] h-[10px] w-[50px] bg-winter-300 rounded-full'></div>
        <p className='absolute bottom-0 mb-[106px] ml-[145px] left-0'>0:00</p>
        <p className='absolute bottom-0 mb-[106px] mr-[185px] right-0'>3:30</p>
      </div>

      <div className='absolute z-20 w-full justify-center ml-[-23px] flex mt-[-30px]'>
        <div className='relative bg-white border-[1px] border-gray-500 w-[250px] h-[50px] rounded grid grid-cols-2'>
          <div className=''>
            <Circle fill='#F5535E' strokeWidth={0} width={'25px'} height={'25px'} className='absolute mt-[12px] ml-[50px] cursor-pointer' />
          </div>
          <div>
            <Headset color='#9D9D9D' width={'25px'} height={'25px'} className='absolute mt-[12px] right-0 mr-[50px] cursor-pointer' />
          </div>
          <div className="absolute top-[10px] bottom-[10px] left-1/2 w-[2px] bg-gray-300"></div>
        </div>
      </div>




      {/* 파도 애니메이션 컨테이너 */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
        {/* 첫 번째 파도 */}
        <div className="absolute top-[60%] left-[-30%] bg-[#97A1D6] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift"></div>

        {/* 두 번째 파도 */}
        <div className="absolute top-[60%] left-[-30%] bg-[#97A1D6] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift-fast"></div>

        {/* 세 번째 파도 */}
        <div className="absolute top-[60%] left-[-30%] bg-[#97A1D6] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift-slow"></div>
      </div>

      {/* 이 스타일을 head에 추가하거나 전역 CSS 파일에 포함시켜야 합니다 */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CassetteContent;