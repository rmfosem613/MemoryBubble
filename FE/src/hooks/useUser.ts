import { useState, useCallback } from 'react';
import useUserApi from '@/apis/useUserApi';
import useUserStore from '@/stores/useUserStore';

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchCurrentUser, fetchUserProfile, fetchFamilyInfo } = useUserApi();
  const { setUser, setFamily, resetUser } = useUserStore();

  // 프로필 및 가족 정보를 요청하는 함수
  const fetchProfileAndFamilyInfo = useCallback(
    async (userId: number, familyId: number) => {
      try {
        if (!userId || !familyId) {
          console.warn('사용자 및 가족 정보 요청을 위한 ID가 없습니다.');
          return { profileSuccess: false, familySuccess: false };
        }

        // 프로필 정보 요청
        const profileResponse = await fetchUserProfile(userId);
        if (profileResponse.status === 200) {
          setUser(profileResponse.data);
        }

        // 가족 정보 요청
        const familyResponse = await fetchFamilyInfo(familyId);
        if (familyResponse.status === 200) {
          setFamily(familyResponse.data);
        }

        console.log('사용자 및 가족 정보 요청 성공');
        return {
          profileSuccess: profileResponse.status === 200,
          familySuccess: familyResponse.status === 200,
        };
      } catch (error) {
        console.error('사용자 및 가족 정보 요청 실패:', error);
        return { profileSuccess: false, familySuccess: false };
      }
    },
    [fetchUserProfile, fetchFamilyInfo, setUser, setFamily],
  );

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

      // 토큰이 있으면
      // 1. 현재 사용자 정보 요청
      const userResponse = await fetchCurrentUser();
      if (userResponse.status === 200) {
        const userData = userResponse.data;
        setUser(userData);

        // familyId가 없으면 종료
        // 가족 가입 후 사용자 정보 등록, 가족 탈퇴 없음 -> familyId가 없으면 사용자 정보도 없음
        if (!userData.familyId) {
          setIsLoading(false);
          return;
        }

        // 2. familyId가 있는 경우에만 프로필 및 가족 정보 요청
        // userData에서 직접 ID를 전달
        await fetchProfileAndFamilyInfo(userData.userId, userData.familyId);
      }
    } catch (error) {
      console.error('가입 정보 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, fetchProfileAndFamilyInfo, setUser, resetUser]);

  return {
    isLoading,
    checkAuthAndFetchUserData,
    fetchProfileAndFamilyInfo,
  };
};

export default useUser;
