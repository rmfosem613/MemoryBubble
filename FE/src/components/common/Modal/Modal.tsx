import React, { ReactNode, MouseEvent } from 'react';
import Button from '../Button/Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  cancelButtonText?: string;
  confirmButtonText: string;
  onClose: () => void; // 모달을 닫기 위한 기본 함수
  onCancel?: () => void; // 취소 버튼 클릭 시 추가 로직을 위한 함수
  onConfirm?: () => void; // 확인 버튼 클릭 시 추가 로직을 위한 함수
}

function Modal({
  isOpen,
  title,
  children,
  cancelButtonText,
  confirmButtonText,
  onClose,
  onCancel,
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  // 배경 클릭 시 모달 닫기 핸들러
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = () => {
    // 취소 콜백이 제공된 경우 실행
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirmClick = () => {
    // 확인 콜백이 제공된 경우 실행
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      // 백드롭 (배경 어둡게 및 블러 처리)
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px]"
      onClick={handleBackdropClick}>
      {/* 모달 컨테이너 */}
      <div className="flex flex-col mx-5 bg-white rounded-lg w-[543px] min-h-[200px] max-h-[80vh]">
        {/* 제목 영역 */}
        <h1 className="font-p-700 text-h3-sm p-5 pb-1 md:p-6 md:pb-1 lg:p-7 lg:pb-1 border-b-2 border-dashed border-gray-300 md:text-h3-md lg:text-h3-lg">
          {title}
        </h1>

        {/* 본문 영역 */}
        <div className="flex-1 px-5 py-3 md:px-6 lg:px-8 overflow-auto font-p-500 text-subtitle-1-sm md:text-subtitle-1-md lg:text-subtitle-1-lg text-gray-600">
          {children}
        </div>

        {/* 버튼 영역 */}
        <div className="px-5 py-4 md:px-6 lg:px-8 bg-gray-100 rounded-b-lg flex justify-end space-x-3">
          {/* 취소 버튼 */}
          {cancelButtonText && (
            <div onClick={handleCancelClick}>
              <Button name={cancelButtonText} color="white" />
            </div>
          )}
          {/* 확인 버튼 */}
          <div onClick={handleConfirmClick}>
            <Button name={confirmButtonText} color="blue" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
