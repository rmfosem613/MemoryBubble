import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import InputImg from "@/components/common/Modal/InputImg";
import { getPhotoUploadUrls, convertToWebP, uploadImageToS3 } from "@/apis/photoApi";
import Alert from "@/components/common/Alert"; // Corrected import path

interface PhotoUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: number | null;
  onUploadComplete: () => Promise<void>;
  albumSelectComponent?: React.ReactNode; // 옵셔널: 앨범 선택 컴포넌트
}

const PhotoUploader = ({
  isOpen,
  onClose,
  albumId,
  onUploadComplete,
  albumSelectComponent
}: PhotoUploaderProps) => {
  // 사진 업로드 관련 상태
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  // Alert 관련
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // Alert 표시 함수
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
    
    // 3초 후 Alert 숨기기
    setTimeout(() => {
      setShowAlert(false);
    }, 3500); // Alert 자체 타이머보다 약간 더 길게 설정
  };

  // 이미지 선택 핸들러
  const handleImagesSelected = (images: { file: File; preview: string }[]) => {
    setSelectedImages(images);
  };

  // 사진 업로드 시작 함수
  const handlePhotoUploadStart = () => {
    if (selectedImages.length === 0) {
      showAlertMessage("업로드할 사진을 선택해주세요.", "red");
      return false;
    }

    if (!albumId) {
      showAlertMessage("사진을 업로드할 앨범을 선택해주세요.", "red");
      return false;
    }

    if (isUploadingPhotos) {
      return false; // 이미 업로드 중이면 중복 실행 방지
    }

    setIsUploadingPhotos(true);
    // 비동기 업로드 프로세스 시작
    uploadPhotosProcess();

    return false; // 업로드 완료 후 수동으로 모달 닫기
  };

  // 실제 사진 업로드 프로세스 (비동기)
  const uploadPhotosProcess = async () => {
    try {
      if (!albumId || selectedImages.length === 0) {
        throw new Error("앨범 또는 이미지가 선택되지 않았습니다.");
      }

      // 1. Presigned URL 요청
      const urlsResponse = await getPhotoUploadUrls({
        albumId: albumId,
        photoLength: selectedImages.length
      });

      if (!urlsResponse || urlsResponse.length !== selectedImages.length) {
        throw new Error("업로드 URL 수신 오류");
      }

      // 2. 각 이미지를 WebP로 변환하고 S3에 업로드
      const totalImages = selectedImages.length;
      let successCount = 0;

      for (let i = 0; i < totalImages; i++) {
        try {
          // 이미지를 WebP로 변환
          const imageBlob = await convertToWebP(selectedImages[i].file);

          // S3에 업로드
          const uploadSuccess = await uploadImageToS3(
            urlsResponse[i].presignedUrl,
            imageBlob
          );

          if (uploadSuccess) {
            successCount++;
          }

        } catch (error) {
          console.error(`이미지 ${i + 1} 업로드 실패:`, error);
        }
      }

      // 3. 완료 메시지 및 정리
      if (successCount === 0) {
        showAlertMessage("모든 이미지 업로드에 실패했습니다. 다시 시도해주세요.", "red");
      } else if (successCount < totalImages) {
        showAlertMessage(`일부 이미지만 업로드되었습니다. (${successCount}/${totalImages})`, "red");
      } else {
        showAlertMessage("모든 이미지가 성공적으로 업로드되었습니다.", "green");

        // 앨범 데이터 새로고침 (사진 수 업데이트를 위해)
        await onUploadComplete();

        // 입력 초기화
        setSelectedImages([]);

        // 모달 닫기
        onClose();
      }
    } catch (error) {
      console.error("사진 업로드 오류:", error);
      showAlertMessage("사진 업로드 중 오류가 발생했습니다.", "red");
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <Modal
        isOpen={isOpen}
        onClose={isUploadingPhotos ? undefined : onClose}
        title="추억 보관하기"
        confirmButtonText={isUploadingPhotos ? "업로드 중..." : "보관하기"}
        cancelButtonText={isUploadingPhotos ? undefined : "취소하기"}
        onConfirm={handlePhotoUploadStart}
      >
        <div className="py-2">
          <p className="mb-4">사진은 최대 5장까지 한 번에 추가할 수 있습니다.</p>

          {/* 이미지 선택 컴포넌트 */}
          <InputImg onImagesSelected={handleImagesSelected} />

          {/* 앨범 선택 컴포넌트 (제공된 경우) */}
          {albumSelectComponent}
        </div>
      </Modal>
    </>
  );
};

export default PhotoUploader;