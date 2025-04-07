import React, { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import apiClient from '@/apis/apiClient';

interface FontDeleteModalProps {
  isOpen: boolean;
  close: () => void;
  fontId: string;
  fontName: string | null;
  onDeleteSuccess: () => void;
}

function FontDeleteModal({
  isOpen,
  close,
  fontId,
  fontName,
  onDeleteSuccess,
}: FontDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!fontId) return false;

    // 삭제 요청 시작
    setIsLoading(true);

    try {
      // 폰트 삭제 API 호출
      const response = await apiClient.delete(`/api/fonts/${fontId}`);

      if (response.status === 200) {
        // 브라우저에 로드된 폰트 스타일 요소 제거
        const styleElement = document.getElementById(`font-style-${fontId}`);
        if (styleElement) {
          styleElement.remove();
        }

        console.log(`폰트 ID ${fontId} 삭제 완료`);

        // 삭제 성공 콜백 호출
        onDeleteSuccess();
        return true; // 모달 닫기
      }
    } catch (error) {
      console.error('폰트 삭제 중 오류 발생:', error);
      alert('폰트 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false; // 모달 유지
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="폰트 삭제"
      cancelButtonText="취소하기"
      confirmButtonText={isLoading ? '삭제 중...' : '삭제하기'}
      onConfirm={handleConfirm}
      isConfirmDisabled={isLoading}>
      <p className="py-4">
        [{' '}
        <span className="text-blue-500">{fontName || '사용자 정의 폰트'}</span>{' '}
        ] 폰트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </p>
    </Modal>
  );
}

export default FontDeleteModal;
