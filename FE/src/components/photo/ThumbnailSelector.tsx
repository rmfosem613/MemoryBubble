import React from 'react';
import Modal from "@/components/common/Modal/Modal";
import { updateAlbumThumbnail } from "@/apis/photoApi";

interface ThumbnailSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: number | null;
  selectedPhotoId: number | null;
  photoUrl: string | null;
  onUpdateComplete: () => Promise<void>;
  onError?: (message: string) => void;
}

const ThumbnailSelector: React.FC<ThumbnailSelectorProps> = ({
  isOpen,
  onClose,
  albumId,
  selectedPhotoId,
  photoUrl,
  onUpdateComplete,
  onError
}) => {
  // 썸네일 변경 처리 함수
  const handleUpdateThumbnail = () => {
    if (!selectedPhotoId) {
      const errorMessage = "먼저, 썸네일로 설정할 사진을 선택해주세요.";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return false; // 모달 유지
    }

    if (!albumId) {
      const errorMessage = "앨범 정보를 가져오는 중 오류가 발생했습니다.";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return false; // 모달 유지
    }

    // 썸네일 변경 프로세스 시작 (비동기 처리)
    updateThumbnailProcess(selectedPhotoId);

    return false; // 모달 닫기 방지 (프로세스 완료 후 수동으로 닫을 예정)
  };

  // 실제 썸네일 업데이트 프로세스 (비동기)
  const updateThumbnailProcess = async (photoId: number) => {
    try {
      // 썸네일 변경 API 호출
      await updateAlbumThumbnail(albumId!, photoId);

      // 성공 메시지 표시
      const successMessage = "앨범 대표 이미지가 변경되었습니다.";
      if (onError) {
        onError(successMessage);
      } else {
        alert(successMessage);
      }

      // 앨범 정보 새로고침
      await onUpdateComplete();

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error("썸네일 변경 실패:", error);
      const errorMessage = "대표 이미지 변경 중 오류가 발생했습니다.";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="대표 이미지 변경하기"
      confirmButtonText="변경하기"
      cancelButtonText="취소하기"
      onConfirm={handleUpdateThumbnail}
    >
      <div className="py-2">
        <p className="mb-4">썸네일로 등록할 사진을 확인해주세요</p>
        <div className="w-full flex justify-center">
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Selected thumbnail"
              className="h-64 object-cover"
            />
          )}
          {!photoUrl && (
            <p className="text-gray-500">선택된 이미지가 없습니다.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ThumbnailSelector;