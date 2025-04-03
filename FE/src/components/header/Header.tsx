import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import useHeader from '@/hooks/useHeader';
import HeaderMenuItems from './HeaderMenuItems';
import UserInfo from './UserInfo';
import { useUserStatus } from '@/hooks/useUserSatus';

const Header = () => {
  const { handleLogout } = useHeader();
  const { isLoggedIn, hasCompleteProfile } = useUserStatus();

  return (
    <header className="fixed top-0 h-[50px] md:h-[55px] lg:h-[60px] w-full bg-white/30 backdrop-blur-md flex items-center z-[50]">
      <div className="container flex justify-between items-center">
        {/* 항상 표시 - 로고 */}
        <Link to="/intro">
          <img
            src="/logo-3.svg"
            alt="추억방울"
            className="h-8 md:h-[35px] lg:h-[38px]"
          />
        </Link>

        {/* 로그인한 경우 */}
        {isLoggedIn && (
          <>
            {/* 가족 및 프로필이 있는 경우 */}
            {hasCompleteProfile ? (
              <div className="flex items-center space-x-2">
                <HeaderMenuItems className="flex items-center space-x-1 lg:space-x-2" />
                <UserInfo />
              </div>
            ) : (
              // 가족 및 프로필이 없는 경우 로그아웃만 표시
              <button
                className="flex items-center space-x-1 text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg whitespace-nowrap hover:text-red-700 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}>
                <LogOut className="size-4 md:size-[18px]" />
                <p>로그아웃</p>
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
