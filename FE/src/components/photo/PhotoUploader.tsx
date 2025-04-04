import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { getPhotoUploadUrls } from "@/apis/photoApi";
import ImageSelector from "@/components/common/Modal/ImageSelector";
import ImageCropperModal from "@/components/common/Modal/ImageCropperModal";
import { uploadImageToS3 } from "@/components/common/ImageCrop/imageUtils";

interface PhotoUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: number | null;
  onUploadComplete: () => Promise<void>;
  albumSelectComponent?: React.ReactNode;
}

const PhotoUploader = ({
  isOpen,
  onClose,
  albumId,
  onUploadComplete,
  albumSelectComponent
}: PhotoUploaderProps) => {
  // 사용자가 선택한 원본 이미지 파일들
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 자르기 완료된 이미지 파일들 (최종 결과)
  const [croppedImages, setCroppedImages] = useState<{ file: File; preview: string }[]>([]);

  // 현재 자르고 있는 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);

  // 선택된 가로세로 비율
  const [selectedRatio, setSelectedRatio] = useState<"4:3" | "3:4">("4:3");

  // 업로드 상태
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 모든 이미지 자르기가 완료되었는지 확인
  useEffect(() => {
    if (selectedFiles.length > 0) {
      const croppedCount = croppedImages.filter(img => img && img.preview).length;
      const allCropped = croppedCount === selectedFiles.length;

      // 모든 이미지 자르기 완료 시 크로퍼 닫기
      if (allCropped && currentImageIndex !== -1) {
        setCurrentImageIndex(-1);
      }
    }
  }, [croppedImages, selectedFiles, currentImageIndex]);

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 이미지 선택 시 처리
  const handleImagesSelected = (files: File[]) => {
    // 최대 5개까지만 선택 가능
    if (files.length + selectedFiles.length > 5) {
      showAlertMessage("이미지는 한 번에 최대 5개까지만 업로드할 수 있습니다.", "red");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // 새로 추가된 첫 번째 이미지부터 자르기 시작
    setCurrentImageIndex(selectedFiles.length);
  };

  // 이미지 제거
  const handleRemoveImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    // 잘린 이미지도 함께 제거
    const newCroppedImages = [...croppedImages];
    newCroppedImages.splice(index, 1);
    setCroppedImages(newCroppedImages);
  };

  // 이미지 자르기 완료 처리
  const handleCropComplete = (file: File, previewUrl: string) => {
    const newCroppedImages = [...croppedImages];
    newCroppedImages[currentImageIndex] = { file, preview: previewUrl };
    setCroppedImages(newCroppedImages);

    // 다음 이미지로 이동
    if (currentImageIndex < selectedFiles.length - 1) {
      setTimeout(() => {
        setCurrentImageIndex(currentImageIndex + 1);
      }, 300);
    } else {
      // 모든 이미지 자르기 완료
      setCurrentImageIndex(-1);
    }
  };

  // 가로세로 비율 변경
  const handleRatioChange = (ratio: "4:3" | "3:4") => {
    setSelectedRatio(ratio);
  };

  // 사진 업로드 시작
  const handlePhotoUploadStart = () => {
    if (selectedFiles.length === 0) {
      showAlertMessage("업로드할 이미지를 선택해주세요.", "red");
      return false;
    }

    const croppedCount = croppedImages.filter(img => img && img.preview).length;
    if (croppedCount !== selectedFiles.length) {
      showAlertMessage("모든 이미지를 먼저 잘라주세요.", "red");
      return false;
    }

    if (!albumId) {
      showAlertMessage("사진을 보관할 앨범을 선택해주세요.", "red");
      return false;
    }

    if (isUploadingPhotos) {
      return false;
    }

    setIsUploadingPhotos(true);
    setUploadProgress(0);
    uploadPhotosProcess();

    return false; // 모달 자동 닫힘 방지
  };

  // 실제 업로드 처리 함수
  const uploadPhotosProcess = async () => {
    try {
      const validCroppedImages = croppedImages.filter(img => img && img.preview);

      if (!albumId || validCroppedImages.length === 0) {
        throw new Error("앨범 또는 이미지가 선택되지 않았습니다.");
      }

      // S3 업로드용 presigned URL 요청
      const urlsResponse = await getPhotoUploadUrls({
        albumId: albumId,
        photoLength: validCroppedImages.length
      });

      if (!urlsResponse || urlsResponse.length !== validCroppedImages.length) {
        throw new Error("업로드 URL을 받는 데 문제가 발생했습니다.");
      }

      const totalImages = validCroppedImages.length;
      let successCount = 0;

      for (let i = 0; i < totalImages; i++) {
        try {
          const imageFile = validCroppedImages[i].file;

          // S3에 업로드
          const uploadSuccess = await uploadImageToS3(
            urlsResponse[i].presignedUrl,
            imageFile,
            'image/webp'
          );

          if (uploadSuccess) {
            successCount++;
            setUploadProgress(Math.floor((successCount / totalImages) * 100));
          }
        } catch (error) {
          console.error(`이미지 ${i + 1} 업로드 실패:`, error);
        }
      }

      if (successCount === 0) {
        showAlertMessage("모든 이미지 업로드에 실패했습니다. 다시 시도해주세요.", "red");
      } else if (successCount < totalImages) {
        showAlertMessage(`일부 이미지만 업로드되었습니다. (${successCount}/${totalImages})`, "green");
        await onUploadComplete();
        onClose();
      } else {
        showAlertMessage("모든 이미지가 성공적으로 업로드되었습니다.", "green");
        await onUploadComplete();
        onClose();
      }
    } catch (error) {
      console.error("사진 업로드 중 오류:", error);
      showAlertMessage("업로드 중 오류가 발생했습니다.", "red");
    } finally {
      setIsUploadingPhotos(false);
      setUploadProgress(0);
      setSelectedFiles([]);
      setCroppedImages([]);
    }
  };

  // 모달 안의 본문 렌더링
  const renderModalContent = () => {
    return (
      <div className="p-4">
        {/* 이미지 선택기 */}
        <div className="mb-4">
          <ImageSelector
            onImagesSelected={handleImagesSelected}
            selectedImages={selectedFiles}
            onRemoveImage={handleRemoveImage}
            maxImages={5}
            previewSize="md"
          />
        </div>

        {/* 앨범 선택 컴포넌트 */}
        {albumSelectComponent}

        {/* 자르기 모달 표시 */}
        {currentImageIndex >= 0 && currentImageIndex < selectedFiles.length && (
          <ImageCropperModal
            isOpen={currentImageIndex !== -1}
            onClose={() => setCurrentImageIndex(-1)}
            imageFile={selectedFiles[currentImageIndex]}
            aspectRatio={selectedRatio}
            onCropComplete={handleCropComplete}
            allowedAspectRatios={["4:3", "3:4"]}
            modalTitle="이미지 자르기"
          />
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="추억 보관하기"
      confirmButtonText="보관하기"
      cancelButtonText="취소하기"
      onConfirm={handlePhotoUploadStart}
      onCancel={onClose}
      isConfirmDisabled={
        selectedFiles.length === 0 ||
        croppedImages.filter(img => img && img.preview).length !== selectedFiles.length ||
        isUploadingPhotos
      }
    >
      {renderModalContent()}
    </Modal>
  );
};

export default PhotoUploader;
