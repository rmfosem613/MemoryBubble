import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import { getPhotoUploadUrls, uploadImageToS3 } from "@/apis/photoApi";
import Alert from "@/components/common/Alert";
import SimpleCropper from '@/components/photo/SimpleCropper';

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
  // 업로드 단계 (1: 이미지 선택, 2: 이미지 크롭)
  const [uploadStep, setUploadStep] = useState<1 | 2>(1);

  // 원본 선택 이미지 배열
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 크롭된 이미지 배열 (최종 결과물)
  const [croppedImages, setCroppedImages] = useState<{ file: File; preview: string }[]>([]);

  // 현재 크롭 중인 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // 현재 선택된 자르기 비율 (4:3 또는 3:4)
  const [selectedRatio, setSelectedRatio] = useState<"4:3" | "3:4">("4:3");

  // 업로드 상태
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 모든 이미지 크롭 완료 여부
  const [allImagesCropped, setAllImagesCropped] = useState(false);

  // Alert 관련
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 크롭 완료된 이미지 수를 체크하고 모든 이미지가 크롭되었는지 확인
  useEffect(() => {
    if (selectedFiles.length > 0) {
      const croppedCount = croppedImages.filter(img => img && img.preview).length;
      setAllImagesCropped(croppedCount === selectedFiles.length);
    } else {
      setAllImagesCropped(false);
    }
  }, [croppedImages, selectedFiles]);

  // Alert 표시 함수
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // 최대 5장 제한
    if (files.length > 5) {
      showAlertMessage("사진은 최대 5장까지 추가할 수 있습니다.", "red");
      return;
    }

    setSelectedFiles(files);

    // 크롭된 이미지 배열 초기화
    setCroppedImages([]);
    setAllImagesCropped(false);
  };

  // 다음 단계로 이동 (이미지 선택 -> 이미지 크롭)
  const handleGoToNextStep = () => {
    if (selectedFiles.length === 0) {
      showAlertMessage("업로드할 사진을 선택해주세요.", "red");
      return false; // 모달이 닫히지 않도록 false 반환
    }

    setUploadStep(2);
    setCurrentImageIndex(0);
    return false; // 모달이 닫히지 않도록 false 반환
  };

  // 이전 단계로 이동 (이미지 크롭 -> 이미지 선택)
  const handleGoToPrevStep = () => {
    setUploadStep(1);
    return false; // 모달이 닫히지 않도록 false 반환
  };

  // 현재 이미지 크롭 완료
  const handleCropComplete = (file: File | null, previewUrl?: string) => {
    if (!file || !previewUrl) return;

    // 크롭된 이미지 배열 업데이트
    const newCroppedImages = [...croppedImages];

    // 현재 인덱스의 이미지 업데이트 또는 추가
    newCroppedImages[currentImageIndex] = {
      file,
      preview: previewUrl
    };

    setCroppedImages(newCroppedImages);

    // 다음 이미지로 자동 이동 (마지막 이미지가 아닌 경우)
    if (currentImageIndex < selectedFiles.length - 1) {
      // 약간의 지연 후 다음 이미지로 이동 (UX 개선)
      setTimeout(() => {
        setCurrentImageIndex(currentImageIndex + 1);
      }, 300);
    }
  };

  // 비율 변경 핸들러
  const handleRatioChange = (ratio: "4:3" | "3:4") => {
    setSelectedRatio(ratio);
  };

  // 사진 업로드 시작 함수
  const handlePhotoUploadStart = () => {
    // 모든 이미지가 크롭되지 않았으면 업로드 불가
    if (!allImagesCropped) {
      showAlertMessage("모든 이미지를 크롭해주세요.", "red");
      return false;
    }

    if (!albumId) {
      showAlertMessage("사진을 업로드할 앨범을 선택해주세요.", "red");
      return false;
    }

    if (isUploadingPhotos) {
      return false;
    }

    setIsUploadingPhotos(true);
    setUploadProgress(0);
    uploadPhotosProcess();

    return false; // 모달이 닫히지 않도록 false 반환
  };

  // 실제 사진 업로드 프로세스 (비동기)
  const uploadPhotosProcess = async () => {
    try {
      // 크롭된 이미지만 필터링
      const validCroppedImages = croppedImages.filter(img => img && img.preview);

      if (!albumId || validCroppedImages.length === 0) {
        throw new Error("앨범 또는 이미지가 선택되지 않았습니다.");
      }

      // Presigned URL 요청
      const urlsResponse = await getPhotoUploadUrls({
        albumId: albumId,
        photoLength: validCroppedImages.length
      });

      if (!urlsResponse || urlsResponse.length !== validCroppedImages.length) {
        throw new Error("업로드 URL 수신 오류");
      }

      // 각 이미지를 S3에 업로드
      const totalImages = validCroppedImages.length;
      let successCount = 0;

      for (let i = 0; i < totalImages; i++) {
        try {
          // 이미지 파일 - 이미 크롭 완료
          const imageFile = validCroppedImages[i].file;

          // S3에 업로드
          const uploadSuccess = await uploadImageToS3(
            urlsResponse[i].presignedUrl,
            imageFile
          );

          if (uploadSuccess) {
            successCount++;
            setUploadProgress(Math.floor((successCount / totalImages) * 100));
          }
        } catch (error) {
          console.error(`이미지 ${i + 1} 업로드 실패:`, error);
        }
      }

      // 완료 메시지 및 정리
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
      console.error("사진 업로드 오류:", error);
      showAlertMessage("사진 업로드 중 오류가 발생했습니다.", "red");
    } finally {
      setIsUploadingPhotos(false);
      setUploadProgress(0);
      setSelectedFiles([]);
      setCroppedImages([]);
      setUploadStep(1);
    }
  };

  // 이미지가 이미 크롭되었는지 확인
  const isImageCropped = (index: number) => {
    return croppedImages[index] && croppedImages[index].preview;
  };

  // 현재 모달 제목
  const getModalTitle = () => {
    if (uploadStep === 1) return "추억 보관하기";
    return "이미지 자르기";
  };

  // 현재 모달 확인 버튼 텍스트
  const getConfirmButtonText = () => {
    if (uploadStep === 1) return "다음으로";
    if (isUploadingPhotos) return "업로드 중...";
    return "보관하기";
  };

  // 크롭 모달 이미지 미리보기 영역
  const renderCroppingUI = () => {
    // 모든 이미지가 크롭 완료되었는지 확인 (크롭된 이미지 수 == 선택된 이미지 수)
    const croppedCount = croppedImages.filter(img => img && img.preview).length;
    const allCropped = croppedCount === selectedFiles.length;

    // 현재 이미지가 크롭 완료되었는지 확인
    const currentImageCropped = isImageCropped(currentImageIndex);

    return (
      <div className="py-2">
        <>
          {/* 자르기 비율 옵션 */}
          <div className="flex justify-between space-x-2 mb-4">
            <div className="space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${selectedRatio === "4:3" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handleRatioChange("4:3")}
              >
                4:3 자르기
              </button>
              <button
                className={`px-4 py-2 rounded-md ${selectedRatio === "3:4" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handleRatioChange("3:4")}
              >
                3:4 자르기
              </button>
            </div>
            <p>{currentImageIndex + 1}/{selectedFiles.length}</p>

          </div>

          {/* 이미지 크로퍼 - SimpleCropper 사용 */}
          <div className="mb-4">
            <SimpleCropper
              imageFile={selectedFiles[currentImageIndex]}
              aspectRatio={selectedRatio}
              onCropComplete={(file, previewUrl) => {
                handleCropComplete(file, previewUrl);
              }}
            />
          </div>
        </>
      </div>
    );
  };

  // 이미지 선택 UI
  const renderSelectUI = () => {
    return (
      <div className="py-2">
        <p className="mb-4">사진은 최대 5장까지 한 번에 추가할 수 있습니다.</p>

        {/* 이미지 선택 영역 */}
        <div className="w-full mb-4">
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* 선택된 이미지 목록 - 가로 스크롤 지원 */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {/* 이미지 추가 버튼 */}
              <label
                htmlFor="photo-upload"
                className="w-[100px] h-[100px] flex-shrink-0 flex flex-col items-center justify-center border border-gray-300 rounded-md cursor-pointer bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs text-gray-500 mt-1">이미지 추가</span>
              </label>

              {/* 선택된 이미지 미리보기 */}
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative w-[100px] h-[100px] flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      const newFiles = [...selectedFiles];
                      newFiles.splice(index, 1);
                      setSelectedFiles(newFiles);
                    }}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 앨범 선택 컴포넌트 */}
        {albumSelectComponent}
      </div>
    );
  };

  // 모달 내용
  const renderModalContent = () => {
    if (uploadStep === 1) {
      return renderSelectUI();
    } else {
      return renderCroppingUI();
    }
  };

  // 모달 확인 버튼 핸들러
  const handleConfirmClick = () => {
    if (uploadStep === 1) {
      return handleGoToNextStep();
    } else {
      return handlePhotoUploadStart();
    }
  };

  // 모달 취소 버튼 핸들러
  const handleCancelClick = () => {
    if (uploadStep === 2) {
      return handleGoToPrevStep();
    }
    return true; // 닫기
  };

  // 모달 취소 버튼 텍스트
  const getCancelButtonText = () => {
    if (uploadStep === 1) return "취소하기";
    if (isUploadingPhotos) return undefined;
    return "이전으로";
  };

  // 확인 버튼 비활성화 여부
  const isConfirmButtonDisabled = () => {
    // 이미지 자르기 단계에서는 모든 이미지가 크롭되지 않으면 버튼 비활성화
    if (uploadStep === 2 && !allImagesCropped) {
      return true;
    }
    return false;
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <Modal
        isOpen={isOpen}
        onClose={isUploadingPhotos ? undefined : onClose}
        title={getModalTitle()}
        confirmButtonText={getConfirmButtonText()}
        cancelButtonText={getCancelButtonText()}
        onConfirm={handleConfirmClick}
        onCancel={handleCancelClick}
        isConfirmDisabled={isConfirmButtonDisabled()}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default PhotoUploader;