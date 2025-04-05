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
  onCropComplete: (file: File, previewUrl: string, index: number) => void;
  onAllCropsComplete?: () => void;
  allowedAspectRatios?: AspectRatioOption[];
  imageQuality?: number;
  modalTitle?: string;
  applyButtonText?: string;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageFiles,
  currentIndex,
  aspectRatio,
  onCropComplete,
  onAllCropsComplete,
  allowedAspectRatios = ["1:1", "4:3", "3:4"],
  imageQuality = 0.95,
  modalTitle = "이미지 자르기",
  // applyButtonText = "자르기",
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

    // 이미지 크기에 맞게 초기 크롭 영역 조정 (더 넓은 영역으로)
    const newCrop: Crop = {
      unit: '%',
      width: 80, // 80%로 크롭 영역 확대
      height: 80 * (1 / aspect),
      x: 0, // 가운데 정렬을 위해 10%에서 시작
      y: 0,
    };

    setCrop(newCrop);

    // 초기 completedCrop도 바로 설정
    setCompletedCrop({
      unit: '%',
      width: 80,
      height: 80 * (1 / aspect),
      x: 0,
      y: 0
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

    // 크롭 영역 너비와 높이 설정 (백분율)
    const cropWidth = 80;
    const cropHeight = cropWidth * (1 / aspect);

    // 마우스 위치를 중심으로 크롭 영역 배치 (이미지 경계 고려)
    let posX = Math.max(0, x - cropWidth / 2);
    let posY = Math.max(0, y - cropHeight / 2);

    // 이미지 오른쪽/아래 경계를 넘어가지 않도록 조정
    if (posX + cropWidth > 100) posX = 100 - cropWidth;
    if (posY + cropHeight > 100) posY = 100 - cropHeight;

    // 새 크롭 영역 설정
    const newCrop: Crop = {
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: posX,
      y: posY,
    };

    setCrop(newCrop);
    setCompletedCrop({
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: posX,
      y: posY
    });
  };

  // 사용자가 크롭을 완료했을 때 호출
  const handleCropComplete = (c: Crop, percentCrop: PercentCrop) => {
    setCompletedCrop(percentCrop);
  };

  // 비율 변경 처리
  const handleRatioChange = (ratio: AspectRatioOption) => {
    setSelectedRatio(ratio);
    if (imgWidth && imgHeight) {
      const aspect = ratio === "1:1" ? 1 : ratio === "4:3" ? 4 / 3 : 3 / 4;
      // 비율 변경 시에도 왼쪽 상단으로 설정
      const newCrop = {
        unit: '%' as const,
        width: 80,
        height: 80 * (1 / aspect),
        x: 0,
        y: 0,
      };
      setCrop(newCrop);

      // 비율 변경 시에도 completedCrop 업데이트
      setCompletedCrop({
        unit: '%',
        width: 80,
        height: 80 * (1 / aspect),
        x: 0,
        y: 0
      });
    }
  };

  // 크롭 영역이 유효한지 검사하는 함수
  const isCropValid = () => {
    // 크롭 영역이 없거나 너무 작은 경우 (최소 30% 이상 크기)
    if (!completedCrop || completedCrop.width < 30 || completedCrop.height < 30) {
      return false;
    }
    return true;
  };

  // 현재 이미지에 대한 자르기 로직
  const handleApplyCrop = async () => {
    if (!completedCrop || !imgRef.current || !currentImageFile) {
      showAlertMessage("이미지 영역이 지정되지 않았습니다. 영역을 선택해주세요.", "red");
      return false;
    }

    // 크롭 영역이 유효한지 체크
    if (!isCropValid()) {
      showAlertMessage("자르기 영역이 너무 작습니다. 더 넓은 영역을 선택해주세요.", "red");
      return false;
    }

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
    if (!ctx) return false;

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

    // 잘라낸 이미지를 Blob으로 변환
    canvas.toBlob(
      (blob) => {
        if (!blob || !currentImageFile) return;

        const croppedFile = new File([blob], currentImageFile.name, {
          type: 'image/webp',
          lastModified: Date.now()
        });

        const croppedUrl = URL.createObjectURL(blob);
        setIsCropComplete(true);

        onCropComplete(croppedFile, croppedUrl, currentIndex);

        if (isLastImage && onAllCropsComplete) {
          onAllCropsComplete();
        }
      },
      'image/webp',
      imageQuality
    );
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
              className="max-w-full"
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
                  pointerEvents: 'auto'
                }}
                onLoad={onImageLoad}
                onClick={createCropAtPosition} // 클릭한 위치에 crop 영역 생성
                draggable="false"
              />
            </ReactCrop>
          </div>
        </div>
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
        onConfirm={handleApplyCrop}
        onCancel={onClose}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default ImageCropperModal;