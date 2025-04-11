import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';
import { useHasCompleteProfile } from './useUserSatus';

const kakaoConfig = {
  client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
  logout_redirect_uri: import.meta.env.VITE_KAKAO_LOGOUT_REDIRECT_URI,
};

const useHeader = () => {
  const { resetUser } = useUserStore();
  const { logout, checkUnreadLetter } = useUserApi();
  const location = useLocation();
  const hasCompleteProfile = useHasCompleteProfile();

  // 메뉴 상태 관리
  const [isUnread, setIsUnread] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // 메뉴 토글 함수
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // 메뉴 닫기 함수
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  //  편지 상태
  useEffect(() => {
    if (hasCompleteProfile) {
      if (location.pathname === '/storage') {
        setIsUnread(false);
      } else {
        const checkForUnreadLetters = async () => {
          try {
            const letterResponse = await checkUnreadLetter();
            if (letterResponse.status === 200) {
              setIsUnread(letterResponse.data.isUnread);
            }
          } catch (letterError) {
            console.error('읽지 않은 편지 확인 실패:', letterError);
          }
        };

        checkForUnreadLetters();
      }
    }
  }, [checkUnreadLetter, hasCompleteProfile, location.pathname]);

  // 경로 일치하는지 확인
  const isActivePath = useCallback(
    (path: string) => {
      return location.pathname === path;
    },
    [location.pathname],
  );

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${kakaoConfig.client_id}&logout_redirect_uri=${kakaoConfig.logout_redirect_uri}`;
    try {
      // 로컬 로그아웃 및 토큰 삭제 처리
      const response = await logout();
      if (response.status === 200) {
        // 토큰 삭제 및 페이지 이동 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        resetUser();
      }
    } catch (error) {
      // 오류가 발생해도 토큰 삭제 및 페이지 이동 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      resetUser();
    }
  }, [logout, resetUser]);

  return {
    isMenuOpen,
    menuRef,
    buttonRef,
    isUnread,
    isActivePath,
    toggleMenu,
    closeMenu,
    handleLogout,
  };
};

export default useHeader;
