import React, { useState } from 'react';
import Modal from "@/components/common/Modal/Modal";
import DropDown from "@/components/common/Modal/DropDown";
import { movePhotosToAlbum } from "@/apis/photoApi";
import Alert from "@/components/common/Alert";

interface Album {
  id: number;
  title: string;
  photoCount: number;
}

interface PhotoMoverProps {
  isOpen: boolean;
  onClose: () => void;
  sourceAlbumId: number | null;
  photoIds: number[];
  albums: Album[];
  onMoveComplete: () => Promise<void>;
  onError?: (message: string, color?: string) => void;
  onResetSelection?: () => void;
}

function PhotoMover({
  isOpen,
  onClose,
  sourceAlbumId,
  photoIds,
  albums,
  onMoveComplete,
  onError,
  onResetSelection
}: PhotoMoverProps) {
  const [targetAlbumId, setTargetAlbumId] = useState<number | null>(null);

  // Alert 관련
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // Alert 표시 함수
  const showAlertMessage = (message: string, color: string) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    // 3초 후 Alert 숨기기 (Alert 컴포넌트 자체 숨김 외에도 추가)
    setTimeout(() => {
      setShowAlert(false);
    }, 3500); // Alert 자체 타이머보다 약간 더 길게 설정
  };

  // 앨범 이동 처리 함수
  const handleMovePhotos = () => {
    if (photoIds.length === 0) {
      const errorMessage = "이동할 사진을 먼저 선택해주세요.";
      if (onError) {
        onError(errorMessage, "red");
      } else {
        showAlertMessage(errorMessage, "red");
      }
      return false;
    }

    if (!sourceAlbumId) {
      const errorMessage = "앨범 정보를 가져오는 중 오류가 발생했습니다.";
      if (onError) {
        onError(errorMessage, "red");
      } else {
        showAlertMessage(errorMessage, "red");
      }
      return false;
    }

    if (!targetAlbumId || targetAlbumId === sourceAlbumId) {
      const errorMessage = "이동할 대상 앨범을 선택해주세요.";
      if (onError) {
        onError(errorMessage, "red");
      } else {
        showAlertMessage(errorMessage, "red");
      }
      return false;
    }

    // 앨범 이동 프로세스 시작 (비동기 처리)
    movePhotosProcess(targetAlbumId);

    return false; // 모달 닫기 방지
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
        onError(successMessage, "green");
      } else {
        showAlertMessage(successMessage, "green");
      }

      // 앨범 정보 새로고침
      await onMoveComplete();

      // 선택 모드 초기화
      if (onResetSelection) {
        onResetSelection();
      }

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error("사진 이동 실패:", error);
      const errorMessage = "사진 이동 중 오류가 발생했습니다.";
      if (onError) {
        onError(errorMessage, "red");
      } else {
        showAlertMessage(errorMessage, "red");
      }
    }
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
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
            albums={albums.filter(album => album.photoCount + photoIds.length <= 30)}
            currentAlbumId={sourceAlbumId || undefined}
            onSelectAlbum={handleTargetAlbumSelect}
            placeholder="앨범을 선택해주세요"
          />
          <div className="text-sm text-gray-500 mt-2">
            선택된 사진 {photoIds.length}장을 이동합니다.
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PhotoMover;