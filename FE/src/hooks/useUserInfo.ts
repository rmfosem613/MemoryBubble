import { useState, useCallback } from 'react';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

// 커스텀 알림 타입 정의
interface CustomAlert {
  message: string;
  color: 'red' | 'green';
  isVisible: boolean;
}

const useUserInfo = () => {
  const { user } = useUserStore();
  const { getFamilyInviteCode, logout } = useUserApi();

  // 드롭다운 관련 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  // 커스텀 알림 상태
  const [customAlert, setCustomAlert] = useState<CustomAlert>({
    message: '',
    color: 'green',
    isVisible: false,
  });

  // 커스텀 알림 표시 함수
  const showCustomAlert = useCallback(
    (message: string, color: 'red' | 'green') => {
      setCustomAlert({
        message,
        color,
        isVisible: true,
      });

      // 3초 후 알림 자동 숨김 (Alert 컴포넌트 내부에서도 처리하지만 상태관리를 위해 여기서도 설정)
      setTimeout(() => {
        setCustomAlert((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
    },
    [],
  );

  // 드롭다운 토글
  const toggleDropdown = useCallback(() => {
    setShowInviteCode(false);
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  // 초대 코드 복사
  const copyInviteCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      showCustomAlert('초대 코드가 클립보드에 복사되었습니다.', 'green');
    } catch (error) {
      showCustomAlert('초대 코드 복사에 실패했습니다.', 'red');
    }
  }, [inviteCode, showCustomAlert]);

  // 초대 코드 보기 버튼 클릭 시 호출
  const handleShowInviteCode = useCallback(async () => {
    try {
      const response = await getFamilyInviteCode(user.familyId);
      if (response.status === 200) {
        setInviteCode(response.data.code);
        setShowInviteCode(true);
      }
    } catch (error) {
      showCustomAlert('초대 코드를 가져오는데 실패했습니다. 잠시후 다시 시도해주세요.', 'red');
    }
  }, [getFamilyInviteCode, user.familyId, showCustomAlert]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    try {
      // 로그아웃 API 호출
      const response = await logout();
      if (response.status === 200) {
        // 토큰 삭제 및 페이지 이동 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        useUserStore.getState().resetUser();
        window.location.href = '/kakao';
      }
    } catch (error) {
      // 오류가 발생해도 토큰 삭제 및 페이지 이동 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      useUserStore.getState().resetUser();
      window.location.href = '/kakao';
    }
  }, [logout]);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    toggleDropdown,
    showInviteCode,
    setShowInviteCode,
    inviteCode,
    handleShowInviteCode,
    copyInviteCode,
    handleLogout,
    customAlert,
  };
};

export default useUserInfo;
