import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

const useHeader = () => {
  const { user, family, resetUser } = useUserStore(); // 스토어 관련 상태
  const { checkUnreadLetter, logout, getFamilyInviteCode } = useUserApi(); // api 관련
  const location = useLocation(); // 현재 위치 정보 가져오기

  // 헤더 상태 및 검사
  const [isUnread, setIsUnread] = useState(false);
  const isLoggedIn = !!user.userId;
  const hasCompleteProfile = !!user.familyId && !!user.birth;

  // UserInfo 컴포넌트에서 분리한 상태들
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

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
  }, [checkUnreadLetter, hasCompleteProfile, location.pathname]);

  // 사용자 정보 (드롭다운)
  const toggleDropdown = useCallback(() => {
    setShowInviteCode(false);
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  // 초대 코드 복사
  const copyInviteCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      console.log('초대 코드 복사 성공');
    } catch (error) {
      console.log('초대 코드 복사 실패');
    }
  }, [inviteCode]);

  // 초대 코드 보기 버튼 클릭 시 호출
  const handleShowInviteCode = useCallback(async () => {
    try {
      const response = await getFamilyInviteCode(user.familyId);
      if (response.status === 200) {
        setInviteCode(response.data.code);
        setShowInviteCode(true);
      }
    } catch (error) {
      console.error('초대 코드 가져오기 실패:', error);
    }
  }, [getFamilyInviteCode, user.familyId]);

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

    isDropdownOpen,
    setIsDropdownOpen,
    toggleDropdown,
    showInviteCode,
    setShowInviteCode,
    inviteCode,
    handleShowInviteCode,
    copyInviteCode,
  };
};

export default useHeader;
