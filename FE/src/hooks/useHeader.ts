import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

const useHeader = () => {
  const { user, resetUser } = useUserStore(); // 스토어 관련 상태
  const { checkUnreadLetter, logout } = useUserApi(); // api 관련
  const location = useLocation(); // 현재 위치 정보 가져오기

  // 헤더 상태 및 검사
  const [isUnread, setIsUnread] = useState(false)
  const isLoggedIn = !!user.userId;
  const hasCompleteProfile = !!user.familyId && !!user.birth;

  // 읽지 않은 편지 확인 - 페이지 이동시마다 실행
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
  }, [checkUnreadLetter, setIsUnread, hasCompleteProfile, location.pathname]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    try {
      // 로그아웃 API 호출
      const response = await logout();
      if (response.status === 200) {
        // 토큰 삭제 및 페이지 이동 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        resetUser();
        window.location.href = '/kakao';
      }
    } catch (error) {
      // 오류가 발생해도 토큰 삭제 및 페이지 이동 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      resetUser();
      window.location.href = '/kakao';
    }
  }, [logout, resetUser]);

  return {
    isUnread,
    isLoggedIn,
    hasCompleteProfile,
    handleLogout,
  };
};

export default useHeader;
