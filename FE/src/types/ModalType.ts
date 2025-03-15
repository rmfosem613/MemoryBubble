import React, { ReactNode } from 'react';

// 모달 상태 데이터 인터페이스
export interface ModalState {
  isOpen: boolean; // 모달 열림/닫힘 상태
  title: string; // 제목
  content: ReactNode | string; // 본문
  confirmButtonText?: string; // 확인 버튼 텍스트
  cancelButtonText?: string; // 취소 버튼 텍스트
  onConfirmClick?: () => void; // 확인 이벤트 핸들러
}

// 모달 스토어 인터페이스
export interface ModalStore {
  modal: ModalState;
  openModal: (modalData: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

// 모달 훅 인터페이스
export interface ModalHook {
  modal: ModalState;
  openModal: (data: Omit<ModalState, 'isOpen'>) => void;
  handleBackdropClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleConfirmClick: (e: React.MouseEvent) => void;
  handleCancelClick: (e: React.MouseEvent) => void;
}
