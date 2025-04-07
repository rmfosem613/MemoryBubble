import { useEffect, useState } from 'react';

import CassetteReel from '@/assets/letter/cassette-reel.svg';
import Cassette from '@/assets/letter/cassette-1.svg';
import Cassette2 from '@/assets/letter/cassette-2.svg';
import Cassette3 from '@/assets/letter/cassette-3.svg';
import Cassette4 from '@/assets/letter/cassette-4.svg';
import { useLetterStore } from '@/stores/useLetterStore';

// api 연동
import { useUserApi } from '@/apis/useUserApi';
import useUserStore from '@/stores/useUserStore';

interface CassetteImageProps {
  isRecordingOrPlaying: boolean;
  selectedDate?: Date | null;
}

function CassetteImage({ isRecordingOrPlaying, selectedDate }: CassetteImageProps) {
  const { selectedColor, selectedMember } = useLetterStore();
  const [senderName, setSenderName] = useState<string>('');
  const { fetchUserProfile } = useUserApi();
  const { user, family } = useUserStore();

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

  // 현재 사용자 정보 조회
  useEffect(() => {
    const loadUserProfile = async () => {
      try {

        // 사용자 프로필 정보 조회
        const profileResponse = await fetchUserProfile(user.userId);
        const userProfile = profileResponse.data;

        // 보내는 사람 이름 설정
        if (userProfile.name) {
          setSenderName(userProfile.name);
        }
      } catch (error) {
        console.error('사용자 프로필 조회 실패:', error);
      }
    };

    loadUserProfile();
  }, [fetchUserProfile]);

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | null | undefined) => {
    if (!date) {
      return new Date().toLocaleDateString('ko-KR').replace(/\./g, '.');
    }
    return date.toLocaleDateString('ko-KR').replace(/\./g, '.');
  };


  return (
    <div className="flex h-full w-full justify-center mt-[-50px]">
      <div className="mt-[80px] h-[234px]">
        <img
          src={getCassetteImage()}
          className="relative z-10 w-[400px] h-full select-none"
        />
        <img
          src={CassetteReel}
          className={`relative w-[44px] z-10 ${isRecordingOrPlaying ? 'animate-spin-slow' : ''} 
          top-[-149px] left-[24%] sm:left-[93px] md:left-[99px] select-none`}
        />
        <img
          src={CassetteReel}
          className={`relative w-[44px] z-10 ${isRecordingOrPlaying ? 'animate-spin-slow' : ''} 
          top-[-192px] ml-[-15px] sm:ml-0 left-[68%] sm:left-[249px] md:left-[257px] select-none`}
        />

        {/* 카세트 보낸이 */}

        {/* 테이프 css */}
        <div className="relative z-10 flex justify-center top-[-315px] h-full p-[25px]">

        </div>

        <div className="relative z-30 flex justify-center top-[-520px] w-full h-0 sm:h-[130px] overflow-hidden">

          {/* 보내는이 글자 마킹 css */}
          <div className='absolute flex space-x-1  px-2'>
            <div className='absolute w-full h-[60%] -left-0.5 bg-white'></div>
            <div className='absolute w-full h-[60%] bottom-0 -left-0.5 bg-white'></div>

            <p className="z-10 font-p-700 text-h4-lg select-none">From.</p>
            <p className="z-10 pb-[2px] text-h4-lg font-p-700 select-none">
              {senderName ? `${senderName}` : '보내는 사람이 없습니다.'}
            </p>
          </div>


          <p className="relative text-gray-600 mt-[110px] ml-[250px] text-p-lg select-none">
            {formatDate(selectedDate)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CassetteImage;
