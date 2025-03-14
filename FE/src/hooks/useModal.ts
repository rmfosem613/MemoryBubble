// hooks/useModal.ts
import { useState, useCallback } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false); // 모달 상태

  // 모달 열기 함수
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  // 모달 닫기 함수
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
