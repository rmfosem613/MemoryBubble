import React, { useState, useRef } from 'react';

import Alert from '../Alert';

interface ImageSelectorProps {
  onImagesSelected: (files: File[]) => Promise<void>;
  maxImages?: number;
  selectedImages?: File[];
  onRemoveImage?: (index: number) => void;
  className?: string;
  previewSize?: 'sm' | 'md' | 'lg';
  croppedPreviews?: (string | null)[]; // 크롭된 이미지 미리보기 URL 배열 추가
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  onImagesSelected,
  maxImages = 5,
  selectedImages = [],
  onRemoveImage,
  className = '',
  previewSize = 'md',
  croppedPreviews = [] // 기본값 빈 배열
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 미리보기 크기 클래스 결정
  const getSizeClass = () => {
    switch (previewSize) {
      case 'sm': return 'w-[80px] h-[80px]';
      case 'lg': return 'w-[120px] h-[120px]';
      default: return 'w-[100px] h-[100px]';
    }
  };

  const imageSize = getSizeClass();

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

  // 파일 선택 시 처리
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // 최대 이미지 개수 제한
    if (files.length + selectedImages.length > maxImages) {
      showAlertMessage(`한 번에 최대 ${maxImages}개의 이미지를 추가할 수 있습니다.`, "red");
      return;
    }

    // 선택한 파일 부모 컴포넌트로 전달
    await onImagesSelected(files);

    // 파일 인풋 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 제거 처리
  const handleRemoveImage = (index: number) => {
    if (onRemoveImage) {
      onRemoveImage(index);
    }
  };

  // 이미지 소스 URL 결정 (크롭된 버전이 있으면 사용, 없으면 원본)
  const getImageSrc = (index: number) => {
    // 크롭 미리보기가 있으면 그것을 사용
    if (croppedPreviews && croppedPreviews[index]) {
      return croppedPreviews[index];
    }
    // 아니면 원본 이미지 사용
    return URL.createObjectURL(selectedImages[index]);
  };

  return (
    <>

      {showAlert && <Alert message={alertMessage} color={alertColor} />}

      <div className={`w-full ${className}`}>
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />

        {/* 선택된 이미지 컨테이너 - 가로 스크롤 */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {/* 이미지 추가 버튼 */}
            {selectedImages.length < maxImages && (
              <label
                htmlFor="image-upload"
                className={`${imageSize} flex-shrink-0 flex flex-col items-center justify-center border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}
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
                {/* <span className="text-xs text-gray-500 mt-1">이미지 추가</span> */}
              </label>
            )}

            {/* 선택된 이미지 미리보기 */}
            {selectedImages.map((file, index) => {
              if (!croppedPreviews[index]) return null;
              return (
                <div key={index} className={`relative ${imageSize} flex-shrink-0`}>
                  <img
                    src={getImageSrc(index)}
                    alt={`Selected ${index}`}
                    className="border border-gray-300 w-full h-full object-cover rounded-md"
                  />
                  <button
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => handleRemoveImage(index)}
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
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageSelector;