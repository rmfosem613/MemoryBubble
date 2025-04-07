import { Link } from 'react-router-dom';
import { X, Menu, Mail, LogOut, FileType, Image, Calendar } from 'lucide-react';
import useHeader from '@/hooks/useHeader';
import UserInfo from './UserInfo';
import { useUserStatus } from '@/hooks/useUserSatus';

const Header = () => {
  const {
    isMenuOpen,
    menuRef,
    buttonRef,
    isUnread,
    isMainPath,
    isActivePath,
    toggleMenu,
    closeMenu,
    handleLogout,
  } = useHeader();

  const { isLoggedIn, hasCompleteProfile } = useUserStatus();

  const menuItems = [
    { path: '/font', label: '나의 손글씨', icon: FileType },
    { path: '/main', label: '추억 갤러리', icon: Image },
    { path: '/calendar', label: '방울 캘린더', icon: Calendar },
  ];

  const styles = {
    menuItem:
      'px-2 py-1.5 rounded-full hover:bg-black/5 transition-colors duration-300 text-h-logo-md lg:text-h-logo-lg font-p-500',
    menuItemMobile:
      'px-2 py-2 rounded-full hover:bg-black/5 transition-colors duration-300 text-h-logo-md font-p-300 flex space-x-2 items-center border-b border-black/5',
    menuItemAtive: 'text-blue-500',
  };

  return (
    <>
      <header className="fixed top-0 h-[50px] md:h-[55px] lg:h-[60px] w-full bg-white/30 backdrop-blur-md flex items-center z-[50]">
        <div className="container flex justify-between items-center">
          {/* 항상 표시 - 로고 */}
          <Link to="/" className="order-1 sm:order-none">
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
                <>
                  <div className="flex items-center space-x-2 order-2 sm:order-none">
                    <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
                      {menuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`${styles.menuItem} ${isActivePath(item.path) ? styles.menuItemAtive : ''}`}>
                          {item.label}
                        </Link>
                      ))}
                      <Link
                        to="/storage"
                        className={`relative px-2 py-1 rounded-full hover:bg-black/5 transition-colors duration-300 group  ${isActivePath('/storage') || isActivePath('/letter') ? styles.menuItemAtive : ''}`}>
                        <Mail
                          className="size-7 lg:size-[30px]"
                          strokeWidth={1.3}
                        />
                        {isUnread && (
                          <>
                            <span className="absolute top-[6px] right-[7px] h-2 w-2 bg-red-500 rounded-full"></span>
                            <span className="invisible group-hover:visible absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-700 text-white text-xs rounded whitespace-nowrap">
                              읽지 않은 편지가 있습니다
                            </span>
                          </>
                        )}
                      </Link>
                    </div>
                    <UserInfo />
                  </div>

                  {/* 모바일용 메뉴 버튼 */}
                  <div
                    className="sm:hidden relative flex items-center order-0 sm:order-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu();
                    }}
                    ref={buttonRef}>
                    <button>
                      {isMenuOpen ? (
                        <X className="size-6" strokeWidth={1.5} />
                      ) : (
                        <Menu className="size-6" strokeWidth={1.5} />
                      )}
                    </button>
                    {isUnread && !isMenuOpen && (
                      <span className="absolute top-[-3px] right-[-7px] h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                </>
              ) : (
                // 가족 및 프로필이 없는 경우 로그아웃만 표시
                <button
                  className="flex items-center space-x-1 text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg whitespace-nowrap hover:text-red-700 transition-colors duration-300 order-1 sm:order-none"
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

      {/* 모바일용 메뉴 */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`sm:hidden fixed top-[50px] left-0 w-full ${isMainPath() ? 'bg-white/30' : 'bg-white'} backdrop-blur-md z-[50] shadow-sm flex flex-col container space-y-2 py-3`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.menuItemMobile} ${isActivePath(item.path) ? styles.menuItemAtive : ''} `}
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
              }}>
              <item.icon size={26} strokeWidth={1.3} />
              <p>{item.label}</p>
            </Link>
          ))}
          <Link
            to="/storage"
            className={`${styles.menuItemMobile} ${isActivePath('/storage') || isActivePath('/letter') ? styles.menuItemAtive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
            }}>
            <div className="relative">
              <Mail size={26} strokeWidth={1.3} />
              {isUnread && isMenuOpen && (
                <span className="absolute top-[1px] right-[-1px] h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </div>
            <p>편지 보관함</p>
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
