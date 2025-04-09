import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from '@/components/common/Modal/Modal';

import Alert from '../Alert';

export type AspectRatioOption = "1:1" | "4:3" | "3:4";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFiles: File[]; // 이미지 배열 형태로 변경
  currentIndex: number;
  aspectRatio: AspectRatioOption;
  onCropComplete: (file: File, previewUrl: string, index: number, cropData: any) => void;
  // onCropComplete: (file: File, previewUrl: string, index: number) => void;
  onAllCropsComplete?: () => void;
  onCancelAll?: () => void; // 취소
  allowedAspectRatios?: AspectRatioOption[];
  imageQuality?: number;
  modalTitle?: string;
  applyButtonText?: string;
  cancelButtonText?: string;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageFiles,
  currentIndex,
  aspectRatio,
  onCropComplete,
  onAllCropsComplete,
  onCancelAll,
  allowedAspectRatios = ["1:1", "4:3", "3:4"],
  imageQuality = 0.95,
  modalTitle = "이미지 자르기",
  // applyButtonText = "자르기",
  cancelButtonText = "취소하기",
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>("4:3");
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 10,
    height: 10,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PercentCrop | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [isCropComplete, setIsCropComplete] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const currentImageFile = imageFiles[currentIndex];
  const isLastImage = currentIndex === imageFiles.length - 1;

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  // 제목 상태 수정
  const computedModalTitle = `${modalTitle} (${currentIndex + 1}/${imageFiles.length})`;

  // 버튼 상태 수정
  const finalApplyButtonText = isLastImage ? "완료" : "다음";

  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 이미지 미리보기 url
  useEffect(() => {
    if (currentImageFile) {
      const url = URL.createObjectURL(currentImageFile);
      setPreviewUrl(url);
      setIsCropComplete(false);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [currentImageFile]);

  // 초기 비율 설정
  useEffect(() => {
    setSelectedRatio("4:3"); // 초기 비율을 4:3으로 강제 설정
  }, []);

  // 비율 props가 변경되면 선택된 비율 상태도 업데이트
  useEffect(() => {
    if (aspectRatio !== "4:3") {
      setSelectedRatio(aspectRatio);
    }
  }, [aspectRatio]);

  // 선택된 비율을 기반으로 aspect 값 계산
  const getAspectValue = () => {
    switch (selectedRatio) {
      case "1:1": return 1;
      case "4:3": return 4 / 3;
      case "3:4": return 3 / 4;
      default: return 1;
    }
  };

  // 이미지가 로드되었을 때 초기 크롭 설정
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImgWidth(width);
    setImgHeight(height);

    setSelectedRatio("4:3");
    const aspect = getAspectValue();

    // 고정 너비 100px 설정
    const fixedWidth = 100;
    // 비율에 맞는 높이 계산
    const fixedHeight = fixedWidth / aspect;

    // 픽셀값을 퍼센트로 변환
    const percentWidth = (fixedWidth / width) * 100;
    const percentHeight = (fixedHeight / height) * 100;

    // 이미지 중앙에 위치하도록 좌표 계산
    const x = 0;
    const y = 0;

    const newCrop: Crop = {
      unit: '%',
      width: percentWidth,
      height: percentHeight,
      x: x,
      y: y,
    };

    setCrop(newCrop);

    // 초기 completedCrop도 바로 설정
    setCompletedCrop({
      unit: '%',
      width: percentWidth,
      height: percentHeight,
      x: x,
      y: y
    });
  };

  // 마우스 위치 기반 크롭 영역 생성 함수
  const createCropAtPosition = (e: React.MouseEvent<HTMLElement>) => {
    if (!imgRef.current) return;

    const aspect = getAspectValue();
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();

    // 이미지 내에서의 마우스 위치 계산 (백분율)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 고정 너비 100px 설정
    const fixedWidth = 100;
    // 비율에 맞는 높이 계산
    const fixedHeight = fixedWidth / aspect;

    // 픽셀값을 퍼센트로 변환
    const percentWidth = (fixedWidth / img.width) * 100;
    const percentHeight = (fixedHeight / img.height) * 100;

    // 마우스 위치를 중심으로 크롭 영역 배치 (이미지 경계 고려)
    let posX = Math.max(0, x - percentWidth / 2);
    let posY = Math.max(0, y - percentHeight / 2);

    // 이미지 오른쪽/아래 경계를 넘어가지 않도록 조정
    if (posX + percentWidth > 100) posX = 100 - percentWidth;
    if (posY + percentHeight > 100) posY = 100 - percentHeight;

    // 새 크롭 영역 설정
    const newCrop: Crop = {
      unit: '%',
      width: percentWidth,
      height: percentHeight,
      x: posX,
      y: posY,
    };

    setCrop(newCrop);
    setCompletedCrop({
      unit: '%',
      width: percentWidth,
      height: percentHeight,
      x: posX,
      y: posY
    });
  };

  // 모든 이미지 취소 처리
  const handleCancelAll = () => {
    // onCancelAll 콜백이 있으면 호출
    if (onCancelAll) {
      onCancelAll();
    }
    // 모달 닫기
    onClose();
  };

  // 사용자가 크롭을 완료했을 때 호출
  const handleCropComplete = (c: Crop, percentCrop: PercentCrop) => {
    setCompletedCrop(percentCrop);
  };

  // 비율 변경 처리
  const handleRatioChange = (ratio: AspectRatioOption) => {
    setSelectedRatio(ratio);
    if (imgRef.current && imgWidth && imgHeight) {
      const aspect = ratio === "1:1" ? 1 : ratio === "4:3" ? 4 / 3 : 3 / 4;

      // 고정 너비 100px 설정
      const fixedWidth = 100;
      // 비율에 맞는 높이 계산
      const fixedHeight = fixedWidth / aspect;

      // 픽셀값을 퍼센트로 변환
      const percentWidth = (fixedWidth / imgWidth) * 100;
      const percentHeight = (fixedHeight / imgHeight) * 100;

      // 현재 위치를 유지하거나 중앙으로 재배치
      let x = 0;
      let y = 0;

      // 이미지 경계를 벗어나지 않도록 조정
      if (x + percentWidth > 100) x = 100 - percentWidth;
      if (y + percentHeight > 100) y = 100 - percentHeight;
      if (x < 0) x = 0;
      if (y < 0) y = 0;

      const newCrop = {
        unit: '%' as const,
        width: percentWidth,
        height: percentHeight,
        x: x,
        y: y,
      };

      setCrop(newCrop);
      setCompletedCrop({
        unit: '%',
        width: percentWidth,
        height: percentHeight,
        x: x,
        y: y
      });
    }
  };

  // 현재 이미지에 대한 자르기 로직
  const handleApplyCrop = async (): Promise<boolean> => {
    if (!completedCrop || !imgRef.current || !currentImageFile) {
      showAlertMessage("이미지 영역이 지정되지 않았습니다. 영역을 선택해주세요.", "red");
      return false;
    }

    // 로딩 상태 시작
    setIsLoading(true);

    try {
      const canvas = document.createElement('canvas');
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropX = completedCrop.x * image.width * scaleX / 100;
      const cropY = completedCrop.y * image.height * scaleY / 100;
      const cropWidth = completedCrop.width * image.width * scaleX / 100;
      const cropHeight = completedCrop.height * image.height * scaleY / 100;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsLoading(false);
        return false;
      }

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // 실제 cropData 생성 - 원본 이미지 기준으로 계산된 값
      const cropData = {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight
      };

      // 잘라낸 이미지를 Blob으로 변환
      return new Promise<boolean>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob || !currentImageFile) {
              setIsLoading(false);
              resolve(false);
              return;
            }

            const croppedFile = new File([blob], currentImageFile.name, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            const croppedUrl = URL.createObjectURL(blob);
            setIsCropComplete(true);

            // 크롭 데이터와 함께 전달
            onCropComplete(croppedFile, croppedUrl, currentIndex, {
              x: cropX,
              y: cropY,
              width: cropWidth,
              height: cropHeight
            });

            if (isLastImage && onAllCropsComplete) {
              onAllCropsComplete();
            }
            
            // 로딩 상태 종료
            setIsLoading(false);
            resolve(true);
          },
          'image/webp',
          imageQuality
        );
      });
    } catch (error) {
      console.error("이미지 자르기 실패:", error);
      setIsLoading(false);
      return false;
    }
  };

  const renderRatioButtons = () => {
    if (allowedAspectRatios.length <= 1) return null;

    // 비율 라벨
    const ratioLabels: Record<AspectRatioOption, string> = {
      "1:1": "정사각형 (1:1)",
      "4:3": "가로 (4:3)",
      "3:4": "세로 (3:4)"
    };

    return (
      <div className="flex justify-center space-x-2 mb-4">
        {allowedAspectRatios.map((ratio) => (
          <button
            key={ratio}
            className={`px-4 py-2 rounded-md ${selectedRatio === ratio
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
              }`}
            onClick={() => handleRatioChange(ratio)}
            disabled={isLoading}
          >
            {ratioLabels[ratio]}
          </button>
        ))}
      </div>
    );
  };

  const renderModalContent = () => {
    return (
      <div className="py-2">
        {/* 비율 버튼 영역 */}
        {renderRatioButtons()}

        {/* 이미지 크롭 영역 */}
        <div className="flex justify-center mb-2 bg-gray-300">
          <div className="max-w-full" style={{ maxHeight: 'calc(70vh - 200px)' }}>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
              aspect={getAspectValue()}
              minWidth={selectedRatio === "4:3" ? 100 : selectedRatio === "1:1" ? 100 : 0}
              minHeight={selectedRatio === "3:4" ? 135 : selectedRatio === "1:1" ? 100 : 0}
              className="max-w-full"
              disabled={isLoading}
            >
              <img
                ref={imgRef}
                src={previewUrl}
                alt="Crop Preview"
                className="max-w-full max-h-full select-none"
                style={{
                  maxHeight: 'calc(70vh - 200px)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: isLoading ? 'none' : 'auto'
                }}
                onLoad={onImageLoad}
                onClick={isLoading ? undefined : createCropAtPosition} // 로딩 중이면 클릭 비활성화
                draggable="false"
              />
            </ReactCrop>
          </div>
        </div>
        
        {/* 로딩 중일 때 표시할 메시지 */}
        {isLoading && (
          <div className="text-center mt-2 text-blue-500">
            처리 중입니다. 잠시만 기다려주세요...
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={computedModalTitle}
        confirmButtonText={finalApplyButtonText}
        cancelButtonText={cancelButtonText}
        onConfirm={handleApplyCrop}
        onCancel={handleCancelAll}
        isConfirmDisabled={isLoading}
        isCancelDisabled={isLoading}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default ImageCropperModal;