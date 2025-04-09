import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button/Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onClose: () => void; // 모달을 닫기 위한 기본 함수
  onCancel?: () => void | boolean | Promise<boolean>; // 취소 버튼 클릭 시 추가 로직을 위한 함수
  onConfirm?: () => void | boolean | Promise<boolean>; // 확인 버튼 클릭 시 추가 로직을 위한 함수
  isConfirmDisabled?: boolean; // 확인 버튼 비활성화 여부
  isCancelDisabled?: boolean; // 취소 버튼 비활성화 여부
}

function Modal({
  isOpen,
  title,
  children,
  cancelButtonText,
  confirmButtonText = '확인하기',
  onClose,
  onCancel,
  onConfirm,
  isConfirmDisabled = false,
  isCancelDisabled = false,
}: ModalProps) {
  if (!isOpen) return null;

  // // 배경 클릭 시 모달 닫기 핸들러
  // const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     onClose();
  //   }
  // };

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = async () => {
    if (isCancelDisabled) return; // 버튼이 비활성화 되면 재생x

    if (onCancel) {
      const shouldClose = await onCancel();
      if (shouldClose !== false) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirmClick = async () => {
    if (isConfirmDisabled) return; // 버튼이 비활성화된 경우 실행하지 않음

    if (onConfirm) {
      const shouldClose = await onConfirm();
      if (shouldClose !== false) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const modalContent = (
    <div
      // 백드롭 (배경 어둡게 및 블러 처리)
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px]">
      {/* 모달 컨테이너 */}
      <div className="flex flex-col mx-5 bg-white rounded-lg w-[543px] min-h-[200px] max-h-[80vh] font-pretendard font-normal">
        {/* 제목 영역 */}
        <h1 className="font-p-700 text-h3-sm p-5 pb-1 md:p-6 md:pb-1 lg:p-7 lg:pb-1 border-b-2 border-dashed border-gray-300 md:text-h3-md lg:text-h3-lg">
          {title}
        </h1>

        {/* 본문 영역 */}
        <div className="flex-1 px-5 py-3 md:px-6 lg:px-8 overflow-auto font-p-500 text-subtitle-1-sm md:text-subtitle-1-md lg:text-subtitle-1-lg">
          {children}
        </div>

        {/* 버튼 영역 */}
        <div className="px-5 py-4 md:px-6 lg:px-8 bg-gray-100 rounded-b-lg flex justify-end space-x-3">
          {/* 취소 버튼 */}
          {cancelButtonText && (
            <div onClick={isCancelDisabled ? undefined : handleCancelClick}>
              <Button
                name={cancelButtonText}
                color={isCancelDisabled ? "gray" : "white"}
              />
            </div>
          )}
          {/* 확인 버튼 */}
          <div
            onClick={isConfirmDisabled ? undefined : handleConfirmClick}>
            <Button
              name={confirmButtonText}
              color={isConfirmDisabled ? "gray" : "blue"}
            />
          </div>
        </div>
      </div>
    </div >
  );

  return createPortal(modalContent, document.body);
}

export default Modal;