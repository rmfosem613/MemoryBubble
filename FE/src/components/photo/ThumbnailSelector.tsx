import React, { useState } from 'react';
import Modal from "@/components/common/Modal/Modal";
import { updateAlbumThumbnail } from "@/apis/photoApi";
import Alert from "@/components/common/Alert";

interface ThumbnailSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: number | null;
  selectedPhotoId: number | null;
  photoUrl: string | null;
  onUpdateComplete: () => Promise<void>;
  onError?: (message: string, color?: string) => void;
  onCancelMode?: () => void;
}

function ThumbnailSelector({
  isOpen,
  onClose,
  albumId,
  selectedPhotoId,
  photoUrl,
  onUpdateComplete,
  onError,
  onCancelMode
}: ThumbnailSelectorProps) {

  // Alert 관련
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // Alert 표시 함수
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    // 3초 후 Alert 숨기기 (Alert 컴포넌트 자체 숨김 외에도 추가)
    setTimeout(() => {
      setShowAlert(false);
    }, 3500); // Alert 자체 타이머보다 약간 더 길게 설정
  };

  // 모달 닫기 및 취소 함수
  const handleClose = () => {
    onClose();
    if (onCancelMode) {
      onCancelMode();
    }
  };

  // 썸네일 변경 처리 함수
  const handleUpdateThumbnail = () => {
    if (!selectedPhotoId) {
      const errorMessage = "먼저, 썸네일로 설정할 사진을 선택해주세요.";
      if (onError) {
        onError(errorMessage, "red");
      } else {
        showAlertMessage(errorMessage, "red");
      }
      return false; // 모달 유지
    }

    if (!albumId) {
      const errorMessage = "앨범 정보를 가져오는 중 오류가 발생했습니다.";
      if (onError) {
        onError(errorMessage, "red");
      } else {
        showAlertMessage(errorMessage, "red");
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
        onError(successMessage, "green");
      } else {
        showAlertMessage(successMessage, "green");
      }

      // 앨범 정보 새로고침
      await onUpdateComplete();

      // 모달 닫기 및 모드 취소
      handleClose();
    } catch (error) {
      console.error("썸네일 변경 실패:", error);
      const errorMessage = "대표 이미지 변경 중 오류가 발생했습니다.";
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
        onClose={handleClose}
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
    </>
  );
};

export default ThumbnailSelector;