import React from 'react';
import { Mail, UserRound } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStroe';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, familyInfo } = useUserStore();

  return (
    <header className="fixed top-0 h-[65px] w-full bg-white/70 backdrop-blur-sm flex items-center z-[45]">
      <div className="container flex justify-between items-center">
        <Link
          to="/"
          className="text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-800">
          추억방울
        </Link>

        {user?.familyId && (
          <div className="flex items-center space-x-3">
            <Link
              to="/font"
              className="p-1 rounded-full hover:bg-black/10 transition-colors text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500">
              나의 손글씨
            </Link>

            <Link
              to="/"
              className="p-1 rounded-full hover:bg-black/10 transition-colors text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500">
              추억 갤러리
            </Link>

            <Link
              to="/calendar"
              className="p-1 rounded-full hover:bg-black/10 transition-colors text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500">
              방울 캘린더
            </Link>

            <Link
              to="/storage"
              className="relative p-1 rounded-full hover:bg-black/10 transition-colors">
              <Mail
                className="w-6 h-6 md:w-[26px] md:h-[26px] lg:w-7 lg:h-7"
                strokeWidth={1.3}
              />
              {user?.ismail && (
                <span className="absolute top-[5px] right-[2px]  h-2.5 w-2.5 bg-red-500 rounded-full"></span>
              )}
            </Link>

            <div className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full overflow-hidden flex justify-center items-center bg-gray-200">
              {familyInfo?.thumbnailUrl ? (
                <img
                  src={familyInfo.thumbnailUrl}
                  alt="그룹 프로필 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  className="w-6 h-6 md:w-[26px] md:h-[26px] lg:w-7 lg:h-7"
                  strokeWidth={1.3}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
