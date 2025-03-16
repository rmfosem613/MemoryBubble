import { useCallback } from 'react';
import { ModalState, ModalHook } from '@/types/ModalType';
import { useModalStore } from '@/stores/useModalStore';

export function useModal(): ModalHook {
  // 상태
  const {
    modal,
    openModal: storeOpenModal,
    closeModal: storeCloseModal,
  } = useModalStore();

  // 모달 열기
  const openModal = useCallback(
    (modalData: Omit<ModalState, 'isOpen'>) => {
      storeOpenModal(modalData);
    },
    [storeOpenModal],
  );

  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        storeCloseModal();
      }
    },
    [storeCloseModal],
  );

  // 확인 버튼 클릭 처리
  const handleConfirmClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 이벤트 버블링 방지
      if (modal.onConfirmClick) {
        modal.onConfirmClick();
      }
      storeCloseModal();
    },
    [modal.onConfirmClick, storeCloseModal],
  );

  // 취소 버튼 클릭 처리
  const handleCancelClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 이벤트 버블링 방지
      storeCloseModal();
    },
    [storeCloseModal],
  );

  return {
    modal,
    openModal,
    handleBackdropClick,
    handleConfirmClick,
    handleCancelClick,
  };
}
