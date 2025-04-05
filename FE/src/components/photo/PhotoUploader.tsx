import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { getPhotoUploadUrls } from "@/apis/photoApi";
import ImageSelector from "@/components/common/Modal/ImageSelector";
import ImageCropperModal from "@/components/common/Modal/ImageCropperModal";
import { uploadImageToS3 } from "@/components/common/ImageCrop/imageUtils";

import Alert from "../common/Alert";

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

  // 이미지 자르기 모달 표시 여부
  const [isCropperModalOpen, setIsCropperModalOpen] = useState(false);

  // 업로드 상태
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 모달이 닫힐 때 상태 초기화
  const resetState = () => {
    setSelectedFiles([]);
    setCurrentImageIndex(-1);
    setSelectedRatio("4:3");
    setIsUploadingPhotos(false);
    setUploadProgress(0);
    setShowAlert(false);
    setIsCropperModalOpen(false);
  };

  // 이미지 선택 시 자동으로 크롭 모달 열기 - 미처리된 이미지만 대상으로 함
  useEffect(() => {
    // 선택된 파일이 있고 모달이 닫혀있는 상태에서만 실행
    if (selectedFiles.length > 0 && !isCropperModalOpen) {
      // 크롭되지 않은 이미지가 있는지 확인
      const uncroppedIndex = selectedFiles.findIndex((_, index) => {
        // 해당 인덱스의 크롭된 이미지가 없거나 미리보기가 없으면 아직 처리되지 않은 것
        return !croppedImages[index] || !croppedImages[index].preview;
      });

      // 처리되지 않은 이미지가 있으면 해당 인덱스부터 시작
      if (uncroppedIndex !== -1) {
        setCurrentImageIndex(uncroppedIndex);
        setIsCropperModalOpen(true);
      }
    }
  }, [selectedFiles, croppedImages, isCropperModalOpen]);

  // 모달이 열려있는 상태에서 처리할 이미지가 있는지 확인
  useEffect(() => {
    // 모달이 열려있고, 선택된 이미지가 있는 경우에만 실행
    if (isCropperModalOpen && selectedFiles.length > 0) {
      // 현재 인덱스가 범위를 벗어난 경우, 처리되지 않은 첫 번째 이미지를 찾음
      if (currentImageIndex < 0 || currentImageIndex >= selectedFiles.length) {
        const uncroppedIndex = selectedFiles.findIndex((_, index) => {
          return !croppedImages[index] || !croppedImages[index].preview;
        });

        if (uncroppedIndex !== -1) {
          setCurrentImageIndex(uncroppedIndex);
        } else {
          // 모든 이미지가 처리된 경우 모달 닫기
          setIsCropperModalOpen(false);
          setCurrentImageIndex(-1);
        }
      }
    }
  }, [isCropperModalOpen, selectedFiles, croppedImages, currentImageIndex]);

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 이미지 파일 형식 검증 함수 추가
  const isValidImageFormat = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    return allowedTypes.includes(file.type);
  };

  const validateImageContent = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // 이미지가 실제로 로드됐으면 진짜 이미지 파일
          resolve(true);
        };

        img.onerror = () => {
          // 이미지 로드 실패 = 유효하지 않은 이미지 파일
          resolve(false);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        // 파일 읽기 실패
        resolve(false);
      };

      reader.readAsDataURL(file);
    });
  };

  // 이미지 선택 시 처리
  const handleImagesSelected = async (files: File[]) => {
    // 최대 5개까지만 선택 가능 검사
    if (files.length + selectedFiles.length > 5) {
      showAlertMessage("이미지는 한 번에 최대 5개까지만 업로드할 수 있습니다.", "red");
      return;
    }

    // 각 파일의 유효성을 검사하는 배열 생성
    const validationPromises = files.map(async (file) => {
      // MIME 타입 검사
      if (!isValidImageFormat(file)) {
        showAlertMessage(`"${file.name}" 파일 형식이 지원되지 않습니다. JPG, PNG 형식만 업로드 가능합니다.`, "red");
        return null;
      }

      // 파일 크기 검사
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB < 100) {
        showAlertMessage(`"${file.name}" 파일 크기가 너무 작습니다. 최소 100KB 이상이어야 합니다.`, "red");
        return null;
      }
      if (fileSizeKB > 10 * 1024) {
        showAlertMessage(`"${file.name}" 파일 크기가 너무 큽니다. 최대 10MB 이하여야 합니다.`, "red");
        return null;
      }

      // 실제 이미지 파일인지 확인
      const isRealImage = await validateImageContent(file);
      if (!isRealImage) {
        showAlertMessage(`"${file.name}" 파일은 유효한 이미지 파일이 아닙니다.`, "red");
        return null;
      }

      return file;
    });

    // 모든 검증 결과를 기다림
    const validatedResults = await Promise.all(validationPromises);

    // null이 아닌 값(유효한 파일)만 필터링
    const validatedFiles = validatedResults.filter(file => file !== null) as File[];

    // 나머지 기존 코드와 동일...
    const newFiles = [...selectedFiles, ...validatedFiles];
    setSelectedFiles(newFiles);

    const startIndex = selectedFiles.length;
    if (!isCropperModalOpen) {
      setCurrentImageIndex(startIndex);
      setIsCropperModalOpen(true);
    }
  };

  const handleCancelAllImages = () => {
    // 자르는데 성공한 이미지와 자르지 못한 이미지 필터링
    const processedIndices = new Set();

    // 성공적으로 자른 이미지 인덱스 찾기
    croppedImages.forEach((img, index) => {
      if (img && img.preview) {
        processedIndices.add(index);
      }
    });

    // 자르기 완료되었던 이미지는 저장
    const updatedFiles = selectedFiles.filter((_, index) => processedIndices.has(index));
    const updatedCroppedImages = croppedImages.filter((img, index) => processedIndices.has(index));

    // 이미지 상태 업데이트
    setSelectedFiles(updatedFiles);
    setCroppedImages(updatedCroppedImages);
    setCurrentImageIndex(-1);
    setIsCropperModalOpen(false);

    // 이미지 자르기가 취소 되었을 때 alert
    if (updatedFiles.length < selectedFiles.length) {
      showAlertMessage(`처리되지 않은 이미지가 취소되었습니다. (${updatedFiles.length}개 성공)`, "red");
    }
  }

  // 이미지 제거
  const handleRemoveImage = (index: number) => {
    // 선택된 파일 배열에서 제거
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    // 잘린 이미지도 함께 제거
    const newCroppedImages = [...croppedImages];
    newCroppedImages.splice(index, 1);
    setCroppedImages(newCroppedImages);
  };

  // 단일 이미지 자르기 완료 처리
  const handleCropComplete = (file: File, previewUrl: string, index: number) => {
    // 현재 이미지의 크롭 결과 저장
    const newCroppedImages = [...croppedImages];

    // 배열 길이가 충분하지 않으면 확장
    while (newCroppedImages.length <= index) {
      newCroppedImages.push({ file: new File([], "placeholder"), preview: "" });
    }

    newCroppedImages[index] = { file, preview: previewUrl };
    setCroppedImages(newCroppedImages);

    // 다음 처리되지 않은 이미지를 찾음
    let nextIndex = index + 1;

    // 모달을 닫지 않고 바로 다음 이미지로 이동 (항상 모달은 열린 상태 유지)
    if (nextIndex < selectedFiles.length) {
      // 약간의 지연을 주어 사용자가 현재 이미지 처리가 완료됨을 인지하도록 함
      setTimeout(() => {
        setCurrentImageIndex(nextIndex);
      }, 100);
    } else {
      // 마지막 이미지 처리 완료 - 모달은 handleAllCropsComplete에서 닫힘
      handleAllCropsComplete();
    }
  };

  // 모든 이미지 자르기 완료 처리
  const handleAllCropsComplete = () => {
    // 모든 이미지 처리가 완료되면 모달을 닫음
    // 부모 컴포넌트에서만 모달을 닫도록 함
    setTimeout(() => {
      setIsCropperModalOpen(false);
      setCurrentImageIndex(-1);
    }, 500); // 약간의 지연을 주어 마지막 이미지 처리가 시각적으로 완료되는 것을 보여줌
  };

  // 가로세로 비율 변경
  // const handleRatioChange = (ratio: "4:3" | "3:4") => {
  // setSelectedRatio(ratio);
  // };

  // 이미지 크롭 모달 닫기 처리
  const handleCropperModalClose = () => {
    setCurrentImageIndex(-1);
    setIsCropperModalOpen(false);
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
    }
  };

  // 모달이 열릴 때의 효과 처리
  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때는 아무것도 하지 않음
      return;
    }
    // 모달이 열릴 때마다 상태 초기화 (다시 열릴 때 깨끗한 상태로)
    resetState();
  }, [isOpen]);

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
            croppedPreviews={croppedImages.map(img => img?.preview || null)}
          />

          {/* 크기 제한 안내 메시지 */}
          <div className="text-sm-lg text-gray-400 -mt-1">
            이미지 용량 제한: 100KB ~ 10MB <br />
            이미지 형식 제한: png, jpg, jpeg
          </div>
        </div>

        {/* 앨범 선택 컴포넌트 */}
        {albumSelectComponent}


      </div>
    );
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
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

      {/* 이미지 크로퍼 모달 - 이제 모든 이미지를 순차적으로 처리 */}
      {selectedFiles.length > 0 && (
        <ImageCropperModal
          isOpen={isCropperModalOpen && currentImageIndex >= 0 && currentImageIndex < selectedFiles.length}
          onClose={() => {
            // 모달 닫기는 모든 이미지 처리 완료 후에만 허용
            // 그렇지 않으면 사용자가 직접 닫으려 할 때 아무 동작도 하지 않음
            const allImagesCropped = selectedFiles.every((_, index) =>
              croppedImages[index] && croppedImages[index].preview
            );

            if (allImagesCropped) {
              handleCropperModalClose();
            }
          }}
          imageFiles={selectedFiles}
          currentIndex={currentImageIndex}
          aspectRatio={selectedRatio}
          onCropComplete={handleCropComplete}
          onAllCropsComplete={handleAllCropsComplete}
          onCancelAll={handleCancelAllImages}
          allowedAspectRatios={["4:3", "3:4"]}
          modalTitle="이미지 자르기"
          cancelButtonText="취소하기"
        />
      )}
    </>
  );
};

export default PhotoUploader;