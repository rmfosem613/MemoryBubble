import { useState } from 'react';

// 모달 상태 관리를 위한 커스텀 훅
function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
}

export default useModal;
