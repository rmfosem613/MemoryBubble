import CassetteReel from '@/assets/letter/cassette-reel.svg';
import Cassette from '@/assets/letter/cassette-1.svg';
import Cassette2 from '@/assets/letter/cassette-2.svg';
import Cassette3 from '@/assets/letter/cassette-3.svg';
import Cassette4 from '@/assets/letter/cassette-4.svg';
import { useLetterStore } from '@/stores/useLetterStore';

interface CassetteImageProps {
  isRecordingOrPlaying: boolean;
}

function CassetteImage({ isRecordingOrPlaying }: CassetteImageProps) {
  const { selectedColor } = useLetterStore();

  // 선택된 색상에 따라 카세트 이미지 변경
  const getCassetteImage = () => {
    switch (selectedColor) {
      case 'summer':
        return Cassette2; // 여름
      case 'spring':
        return Cassette3; // 봄
      case 'autumn':
        return Cassette4; // 가을
      case 'winter':
      default:
        return Cassette; // 겨울 또는 기본값
    }
  };

  return (
    <div className="flex h-full w-full justify-center mt-[-50px]">
      <div className="mt-[80px] h-[234px]">
        <img
          src={getCassetteImage()}
          className="relative z-10 w-[400px] h-full"
        />
        <img
          src={CassetteReel}
          className={`relative w-[44px] z-10 ${isRecordingOrPlaying ? 'animate-spin-slow' : ''} 
          top-[-149px] left-[24%] sm:left-[93px] md:left-[99px]`}
        />
        <img
          src={CassetteReel}
          className={`relative w-[44px] z-10 ${isRecordingOrPlaying ? 'animate-spin-slow' : ''} 
          top-[-192px] ml-[-15px] sm:ml-0 left-[68%] sm:left-[249px] md:left-[257px]`}
        />

        {/* 카세트 보낸이 */}
        <div className="relative z-30 flex justify-center top-[-315px] h-full p-[25px]">
          <div className="absolute bg-white w-0 sm:w-[120px] h-[20px]" />
          <div className="relative bg-white w-0 sm:w-[120px] h-[20px] ml-[10px] mt-[15px]" />
        </div>

        <div className="relative z-30 flex justify-center top-[-520px] w-full h-0 sm:h-[130px] overflow-hidden">
          <p className="absolute font-p-700 text-h4-lg">From. 아빠</p>
          <p className="relative text-gray-600 mt-[110px] ml-[250px] text-p-lg">
            {new Date().toLocaleDateString('ko-KR').replace(/\./g, '.')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CassetteImage;
