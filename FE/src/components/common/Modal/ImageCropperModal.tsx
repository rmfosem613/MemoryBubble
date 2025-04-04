import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Crop as RefreshCcw } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from '@/components/common/Modal/Modal';

export type AspectRatioOption = "1:1" | "4:3" | "3:4";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  aspectRatio: AspectRatioOption;
  onCropComplete: (file: File, previewUrl: string) => void;
  allowedAspectRatios?: AspectRatioOption[];
  imageQuality?: number;
  modalTitle?: string;
  applyButtonText?: string;
  resetButtonText?: string;
  cancelButtonText?: string;
}

// 주어진 비율로 중앙 정렬된 크롭 영역 생성
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageFile,
  aspectRatio,
  onCropComplete,
  allowedAspectRatios = ["1:1", "4:3", "3:4"],
  imageQuality = 0.95,
  modalTitle = "이미지 자르기",
  applyButtonText = "자르기",
  resetButtonText = "초기화",
  cancelButtonText = "취소하기"
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(aspectRatio);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PercentCrop | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [isCropComplete, setIsCropComplete] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // 이미지 파일이 변경되면 미리보기 URL 생성
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      setIsCropComplete(false);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageFile]);

  // 비율 props가 변경되면 선택된 비율 상태도 업데이트
  useEffect(() => {
    setSelectedRatio(aspectRatio);
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

    const aspect = getAspectValue();
    const newCrop = centerAspectCrop(width, height, aspect);
    setCrop(newCrop);
  };

  // 사용자가 크롭을 완료했을 때 호출
  const handleCropComplete = (c: Crop, percentCrop: PercentCrop) => {
    setCompletedCrop(percentCrop);
  };

  // 크롭 영역을 중앙으로 리셋
  const handleResetCrop = () => {
    if (imgWidth && imgHeight) {
      const aspect = getAspectValue();
      const newCrop = centerAspectCrop(imgWidth, imgHeight, aspect);
      setCrop(newCrop);
    }
  };

  // 비율 변경 처리
  const handleRatioChange = (ratio: AspectRatioOption) => {
    setSelectedRatio(ratio);
    if (imgWidth && imgHeight) {
      const aspect = ratio === "1:1" ? 1 : ratio === "4:3" ? 4 / 3 : 3 / 4;
      const newCrop = centerAspectCrop(imgWidth, imgHeight, aspect);
      setCrop(newCrop);
    }
  };

  // 자른 이미지 적용 처리
  const handleApplyCrop = async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return;

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
        if (!blob || !imageFile) return;

        const croppedFile = new File([blob], imageFile.name, {
          type: 'image/webp',
          lastModified: Date.now()
        });

        const croppedUrl = URL.createObjectURL(blob);
        setIsCropComplete(true);
        onCropComplete(croppedFile, croppedUrl);
        onClose();
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
        <div className="flex justify-center mb-2">
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

        {/* 크롭 리셋 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleResetCrop}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors flex items-center"
          >
            <RefreshCcw size={16} className="mr-1" /> {resetButtonText}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      confirmButtonText={applyButtonText}
      cancelButtonText={cancelButtonText}
      onConfirm={handleApplyCrop}
      onCancel={onClose}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default ImageCropperModal;