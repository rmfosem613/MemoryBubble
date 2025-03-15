import { create } from 'zustand';
import { ModalState, ModalStore } from '@/types/ModalType';

// 초기 상태
const initialState: ModalState = {
  isOpen: false,
  title: '',
  content: '',
  confirmButtonText: '확인하기',
  cancelButtonText: '',
  onConfirmClick: undefined,
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: initialState,

  // 모달 열기
  openModal: (modalData: Omit<ModalState, 'isOpen'>) =>
    set({
      modal: {
        ...modalData,
        isOpen: true,
      },
    }),

  // 모달 닫기
  closeModal: () =>
    set(() => ({
      modal: {
        ...initialState,
      },
    })),
}));
