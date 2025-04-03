import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useUserApi from '@/apis/useUserApi';
import { useHasCompleteProfile } from './useUserSatus';

const useHeaderMenuItems = () => {
  const { checkUnreadLetter } = useUserApi();
  const location = useLocation();
  const hasCompleteProfile = useHasCompleteProfile();

  // 읽지 않은 편지 상태
  const [isUnread, setIsUnread] = useState(false);

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

  return {
    isUnread,
  };
};

export default useHeaderMenuItems;
