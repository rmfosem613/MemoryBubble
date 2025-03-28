import { useState, useCallback } from 'react';
import useUserApi from '@/apis/useUserApi';
import useUserStore from '@/stores/useUserStore';

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchCurrentUser, fetchUserProfile } = useUserApi();
  const { setUser, resetUser } = useUserStore();

  // 토큰 확인 및 사용자 정보 요청 함수
  const checkAuthAndFetchUserData = useCallback(async () => {
    try {
      // 0. 로컬 스토리지에서 토큰 확인
      const token = localStorage.getItem('accessToken');

      // 토큰이 없으면 종료
      if (!token) {
        resetUser(); // 스토어 상태 초기화
        setIsLoading(false);
        return;
      }

      // 1. 현재 사용자 정보 요청
      const userResponse = await fetchCurrentUser();

      if (userResponse.status === 200) {
        const userData = userResponse.data;
        setUser({
          userId: userData.userId,
          familyId: userData.familyId,
        });

        // familyId가 없으면 종료
        if (!userData.familyId) {
          setIsLoading(false);
          return;
        }

        // 2. familyId가 있는 경우에만 프로필 정보 요청
        const profileResponse = await fetchUserProfile(userData.userId);

        if (profileResponse.status === 200) {
          const profileData = profileResponse.data;
          setUser(profileData);
        }
      }
    } catch (error) {
      console.error('인증 정보 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, fetchUserProfile, setUser, resetUser]);

  return {
    isLoading,
    checkAuthAndFetchUserData,
  };
};

export default useUser;
