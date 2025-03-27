import React, { useState } from 'react';
import Modal from "@/components/common/Modal/Modal";
import DropDown from "@/components/common/Modal/DropDown";
import { movePhotosToAlbum } from "@/apis/photoApi";

interface Album {
  id: number;
  title: string;
}

interface PhotoMoverProps {
  isOpen: boolean;
  onClose: () => void;
  sourceAlbumId: number | null;
  photoIds: number[];
  albums: Album[];
  onMoveComplete: () => Promise<void>;
  onError?: (message: string) => void;
}

function PhotoMover({
  isOpen,
  onClose,
  sourceAlbumId,
  photoIds,
  albums,
  onMoveComplete,
  onError
}: PhotoMoverProps) {
  const [targetAlbumId, setTargetAlbumId] = useState<number | null>(null);

  // 앨범 이동 처리 함수
  const handleMovePhotos = () => {
    if (photoIds.length === 0) {
      const errorMessage = "이동할 사진을 먼저 선택해주세요.";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return false;
    }

    if (!sourceAlbumId) {
      const errorMessage = "앨범 정보를 가져오는 중 오류가 발생했습니다.";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return false;
    }

    if (!targetAlbumId || targetAlbumId === sourceAlbumId) {
      const errorMessage = "이동할 대상 앨범을 선택해주세요.";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return false;
    }

    // 앨범 이동 프로세스 시작 (비동기 처리)
    movePhotosProcess(targetAlbumId);

    return false; // 모달 닫기 방지 (프로세스 완료 후 수동으로 닫을 예정)
  };

  // 앨범 선택 핸들러 - 이동할 대상 앨범 ID 설정
  const handleTargetAlbumSelect = (selectedAlbumId: number) => {
    setTargetAlbumId(selectedAlbumId);
  };

  // 실제 사진 이동 프로세스 (비동기)
  const movePhotosProcess = async (targetAlbumId: number) => {
    try {
      // 사진 이동 API 호출
      await movePhotosToAlbum(sourceAlbumId!, targetAlbumId, photoIds);

      // 성공 메시지 표시
      const successMessage = "선택한 사진이 성공적으로 이동되었습니다.";
      if (onError) {
        onError(successMessage);
      } else {
        alert(successMessage);
      }

      // 앨범 정보 새로고침
      await onMoveComplete();

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error("사진 이동 실패:", error);
      const errorMessage = "사진 이동 중 오류가 발생했습니다.";
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
      title="앨범 이동하기"
      confirmButtonText="이동하기"
      cancelButtonText="취소하기"
      onConfirm={handleMovePhotos}
    >
      <div className="py-2">
        <p className="mb-4">이동할 앨범을 선택해주세요.</p>
        <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">
          앨범 선택하기
        </p>
        <DropDown
          albums={albums}
          currentAlbumId={sourceAlbumId || undefined}
          onSelectAlbum={handleTargetAlbumSelect}
          placeholder="앨범을 선택해주세요"
        />
        <div className="text-sm text-gray-500 mt-2">
          선택된 사진 {photoIds.length}장을 이동합니다.
        </div>
      </div>
    </Modal>
  );
};

export default PhotoMover;