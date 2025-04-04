import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Crop as Check } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

type AspectRatioOption = "1:1" | "4:3" | "3:4";

interface SimpleCropperProps {
  imageFile: File;
  aspectRatio: AspectRatioOption;
  onCropComplete: (file: File, previewUrl: string) => void;
}

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

const SimpleCropper: React.FC<SimpleCropperProps> = ({
  imageFile,
  aspectRatio,
  onCropComplete
}) => {
  // 상태 관리
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

  // 참조 객체
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 이미지 URL 생성
  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    setIsCropComplete(false);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  // 현재 비율 계산
  const getAspectValue = () => {
    switch (aspectRatio) {
      case "1:1": return 1;
      case "4:3": return 4 / 3;
      case "3:4": return 3 / 4;
      default: return 1;
    }
  };

  // 이미지 로드 시 초기 크롭 영역 설정
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImgWidth(width);
    setImgHeight(height);

    const aspect = getAspectValue();
    const newCrop = centerAspectCrop(width, height, aspect);
    setCrop(newCrop);
  };

  // 이미지 크롭 완료 시 실행되는 함수
  const handleCropComplete = (c: Crop, percentCrop: PercentCrop) => {
    setCompletedCrop(percentCrop);
  };

  // 크롭 영역 초기화
  const handleResetCrop = () => {
    if (imgWidth && imgHeight) {
      const aspect = getAspectValue();
      const newCrop = centerAspectCrop(imgWidth, imgHeight, aspect);
      setCrop(newCrop);
    }
  };

  // 크롭 적용
  const handleApplyCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

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
    if (!ctx) return;

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

    // 크롭된 이미지를 Blob으로 변환
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const croppedFile = new File([blob], imageFile.name, {
          type: 'image/webp',
          lastModified: Date.now()
        });

        const croppedUrl = URL.createObjectURL(blob);
        setIsCropComplete(true);
        onCropComplete(croppedFile, croppedUrl);
      },
      'image/webp',
      0.9
    );
  };

  return (
    <>
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

      <div className="">
        {!isCropComplete && (
          <button
            onClick={handleApplyCrop}
            className="w-full justify-center bg-blue-500 hover:bg-blue-600 text-white font-p-500 py-2 px-4 rounded transition-colors flex items-center"
          >
            <Check size={16} className="mr-1" /> 자르기 완료
          </button>
        )}
      </div>
    </>
  );
};

export default SimpleCropper;