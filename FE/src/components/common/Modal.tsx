import React from 'react';
import { useModalStore } from '@/stores/useModalStore';
import { useModal } from '@/hooks/useModal';

function Modal() {
  // 상태
  const { isOpen, title, content, confirmButtonText, cancelButtonText } =
    useModalStore().modal;

  // 함수
  const {
    handleBackdropClick, // 배경 클릭 시 모달 닫기
    handleConfirmClick, // 확인 버튼 클릭 함수
    handleCancelClick, // 취소 버튼 클릭 함수
  } = useModal();

  return (
    <>
      {isOpen && (
        <div
          // 백드롭 (배경 어둡게 및 블러 처리)
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px]"
          onClick={handleBackdropClick}>
          {/* 모달 컨테이너 */}
          <div className="flex flex-col mx-5 bg-white rounded-lg w-[543px] min-h-[200px] max-h-[80vh]">
            {/* 제목 영역 */}
            <h1 className="font-h3 text-h3-sm p-5 pb-1 md:p-6 md:pb-1 lg:p-7 lg:pb-1 border-b-2 border-dashed border-gray-300 md:text-h3-md lg:text-h3-lg">
              {title}
            </h1>

            {/* 본문 영역 */}
            <div className="flex-1 px-5 py-3 md:px-6 lg:px-8 overflow-auto">
              {content}
            </div>

            {/* 버튼 영역 */}
            <div className="px-5 py-4 md:px-6 lg:px-8 bg-gray-100 rounded-b-lg flex justify-end space-x-3">
              {/* 취소 버튼 */}
              {cancelButtonText && (
                <button className="border" onClick={handleCancelClick}>
                  {cancelButtonText}
                </button>
              )}
              {/* 확인 버튼 */}
              <button className="border" onClick={handleConfirmClick}>
                {confirmButtonText || '확인하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
