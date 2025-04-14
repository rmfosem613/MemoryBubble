/**
 * Modal Component
 *
 * 모달은 백드롭(어두운 오버레이)와 내용을 포함한 컨테이너로 구성됩니다.
 * createPortal을 사용하여 DOM 계층과 독립적으로 렌더링합니다.
 */
import React, { ReactNode, MouseEvent, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button/Button';

// 모달 컴포넌트의 Props 타입 정의
interface ModalProps {
  isOpen: boolean; // 모달의 표시 여부
  title: string; // 모달의 제목
  children: ReactNode; // 모달의 내용 (JSX 요소)
  cancelButtonText?: string; // 취소 버튼의 텍스트 (선택적)
  confirmButtonText?: string; // 확인 버튼의 텍스트 (기본값: '확인하기')
  onClose: () => void; // 모달 닫기 함수
  onCancel?: () => void | boolean | Promise<boolean>; // 취소 버튼 클릭 시 실행될 함수 (선택적)
  onConfirm?: () => void | boolean | Promise<boolean>; // 확인 버튼 클릭 시 실행될 함수 (선택적)
  isConfirmDisabled?: boolean; // 확인 버튼 비활성화 상태 (기본값: false)
  isCancelDisabled?: boolean; // 취소 버튼 비활성화 상태 (기본값: false)
  isLoading?: boolean; // 외부에서 제어하는 로딩 상태 (기본값: false)
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
  isLoading = false,
}: ModalProps) {
  // 내부 로딩 상태 관리
  const [internalLoading, setInternalLoading] = useState(false);

  // 외부 로딩 상태와 내부 로딩 상태를 결합
  // 둘 중 하나라도 true면 모달은 로딩 상태로 간주됨
  const isActuallyLoading = isLoading || internalLoading;

  // 외부 상태가 변경되면 내부 상태 초기화
  useEffect(() => {
    if (!isLoading) {
      setInternalLoading(false);
    }
  }, [isLoading]);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // // 백드롭(배경) 클릭 핸들러
  // const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
  //   // 로딩 중에는 모든 클릭 이벤트 차단
  //   if (isLoading) {
  //     e.preventDefault(); // 기본 이벤트 방지
  //     e.stopPropagation(); // 이벤트 버블링 방지
  //     return;
  //   }
  //   // 클릭 이벤트가 백드롭 자체에서 발생한 경우에만 모달 닫기
  //   // e.target(클릭된 요소)과 e.currentTarget(이벤트 핸들러가 연결된 요소)이
  //   // 동일한 경우에만 모달을 닫음 - 이를 통해 모달 내부 클릭은 무시됨
  //   if (e.target === e.currentTarget) {
  //     onClose();
  //   }
  // };

  // // 모달 내부 클릭 처리 핸들러
  // const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
  //   // 로딩 중일 때 모든 클릭 이벤트 차단
  //   if (isLoading) {
  //     e.preventDefault(); // 기본 이벤트 방지
  //     e.stopPropagation(); // 이벤트 버블링 방지
  //     return;
  //   }
  //   // 모달 내부 클릭 이벤트가 상위 요소(백드롭)로 전파되지 않도록 방지
  //   e.stopPropagation();
  // };

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 로딩 중이거나 버튼이 비활성화된 경우 클릭 이벤트 차단
    if (isActuallyLoading || isCancelDisabled) {
      return;
    }

    if (onCancel) {
      try {
        setInternalLoading(true); // 내부 로딩 상태 활성화

        // onCancel 함수 실행 후 반환값이 false가 아닌 경우에만 모달 닫기
        const shouldClose = await onCancel();
        if (shouldClose !== false) {
          onClose();
        }
      } finally {
        setInternalLoading(false); // 내부 로딩 상태 비활성화
      }
    } else {
      // onCancel 함수가 없는 경우 바로 모달 닫기
      onClose();
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirmClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 로딩 중이거나 버튼이 비활성화된 경우 클릭 이벤트 차단
    if (isActuallyLoading || isConfirmDisabled) {
      return;
    }

    if (onConfirm) {
      try {
        setInternalLoading(true); // 내부 로딩 상태 활성화

        // onConfirm 함수 실행 후 반환값이 false가 아닌 경우에만 모달 닫기
        const shouldClose = await onConfirm();
        if (shouldClose !== false) {
          onClose();
        }
      } finally {
        setInternalLoading(false); // 내부 로딩 상태 비활성화
      }
    } else {
      // onConfirm 함수가 없는 경우 바로 모달 닫기
      onClose();
    }
  };

  // 모달 콘텐츠
  const modalContent = (
    <div
      // 백드롭 (배경 어둡게 및 블러 처리)
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-[2px] ${
        isActuallyLoading ? 'cursor-progress' : ''
      }`}
      // onClick={handleBackdropClick}
    >
      {/* 모달 컨테이너 */}
      <div
        className={`flex flex-col mx-5 bg-white rounded-lg w-[543px] min-h-[200px] max-h-[80vh] font-pretendard font-normal ${
          isActuallyLoading ? 'pointer-events-none' : ''
        }`}
        // onClick={handleModalClick}
      >
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
            <div onClick={handleCancelClick}>
              <Button
                name={cancelButtonText}
                // 로딩 중이거나 버튼이 비활성화된 경우 회색으로 표시
                color={isActuallyLoading || isCancelDisabled ? 'gray' : 'white'}
              />
            </div>
          )}
          {/* 확인 버튼 */}
          <div onClick={handleConfirmClick}>
            <Button
              name={confirmButtonText}
              // 버튼이 비활성화된 경우 회색으로 표시
              color={isConfirmDisabled ? 'gray' : 'blue'}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // createPortal을 사용하여 모달 콘텐츠를 document.body에 직접 렌더링
  return createPortal(modalContent, document.body);
}

export default Modal;
