import { useCallback } from 'react';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

const useHeader = () => {
  const { resetUser } = useUserStore(); 
  const { logout } = useUserApi(); 
  
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
    handleLogout,
  };
};

export default useHeader;
