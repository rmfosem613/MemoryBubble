import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from '@/components/common/Modal/Modal';

export type AspectRatioOption = "1:1" | "4:3" | "3:4";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFiles: File[]; // Changed from single imageFile to array of imageFiles
  currentIndex: number; // Current image index being cropped
  aspectRatio: AspectRatioOption;
  onCropComplete: (file: File, previewUrl: string, index: number) => void; // Added index parameter
  onAllCropsComplete?: () => void; // New callback for when all crops are done
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
  applyButtonText = "자르기",
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

  // Update modal title to show progress
  const computedModalTitle = `${modalTitle} (${currentIndex + 1}/${imageFiles.length})`;

  // Update button text for the last image
  const finalApplyButtonText = isLastImage ? "완료" : "다음";

  // Create preview URL when current image changes
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
      width: 30, // 80%로 크롭 영역 확대
      height: 30 * (1 / aspect),
      x: 0, // 가운데 정렬을 위해 10%에서 시작
      y: 0,
    };

    setCrop(newCrop);

    // 초기 completedCrop도 바로 설정
    setCompletedCrop({
      unit: '%',
      width: 30,
      height: 30 * (1 / aspect),
      x: 0,
      y: 0
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
        width: 30,
        height: 30 * (1 / aspect),
        x: 0,
        y: 0,
      };
      setCrop(newCrop);

      // 비율 변경 시에도 completedCrop 업데이트
      setCompletedCrop({
        unit: '%',
        width: 30,
        height: 30 * (1 / aspect),
        x: 0,
        y: 0
      });
    }
  };

  // Process the current image crop
  const handleApplyCrop = async () => {
    if (!completedCrop || !imgRef.current || !currentImageFile) return;

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
        
        // Call the crop complete callback with the current index
        onCropComplete(croppedFile, croppedUrl, currentIndex);
        
        // Only notify about completion if this is the last image
        // Note: We never close the modal from here, only notify parent
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
                className="max-w-full max-h-full"
                style={{ maxHeight: 'calc(70vh - 200px)' }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        </div>
      </div>
    );
  };

  return (
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
  );
};

export default ImageCropperModal;