import React, { useEffect } from 'react';
import { Crop, X, RefreshCcw, Check } from 'lucide-react';
import ReactCrop, { type Crop as LibCrop } from 'react-image-crop';
import useImageCropper, { type AspectRatioOption } from './useImageCropper';
import 'react-image-crop/dist/ReactCrop.css';

// ImageCropper 컴포넌트 Props 인터페이스
export interface ImageCropperProps {
  onImageChange: (file: File | null, previewUrl?: string) => void;
  initialImage?: File | null;
  initialPreviewUrl?: string | null;
  allowedAspectRatios?: AspectRatioOption[];
  defaultAspectRatio?: AspectRatioOption;
  minSize?: number; // 최소 크기 (KB)
  maxSize?: number; // 최대 크기 (MB)
  imageQuality?: number; // 이미지 품질 (0.0 ~ 1.0)
  renderPreview?: (previewUrl: string | null, handleButtonClick: () => void) => React.ReactNode;
  renderUploadBox?: (handleButtonClick: () => void, handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void, handleDrop: (e: React.DragEvent<HTMLDivElement>) => void) => React.ReactNode;
  modalTitle?: string;
  applyButtonText?: string;
  resetButtonText?: string;
  cancelButtonText?: string;
  cropperClassName?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onImageChange,
  initialImage = null,
  initialPreviewUrl = null,
  allowedAspectRatios = ["1:1", "4:3", "3:4"],
  defaultAspectRatio = "1:1",
  minSize = 100, // 기본 최소 100KB
  maxSize = 3, // 기본 최대 3MB
  imageQuality = 0.95, // 기본 품질 95%
  renderPreview,
  renderUploadBox,
  modalTitle = "이미지 자르기",
  applyButtonText = "적용",
  resetButtonText = "초기화",
  cancelButtonText = "취소",
  cropperClassName = ""
}) => {
  const {
    image,
    previewUrl,
    showCropper,
    selectedRatio,
    crop,
    error,
    fileInputRef,
    imgRef,
    handleImageChange,
    handleButtonClick,
    handleDragOver,
    handleDrop,
    handleCropComplete,
    handleRatioChange,
    handleApplyCrop,
    handleCancelCrop,
    handleResetCrop,
    setCrop,
    setShowCropper
  } = useImageCropper({
    initialImage,
    initialPreviewUrl,
    allowedAspectRatios,
    defaultAspectRatio,
    minSize,
    maxSize,
    imageQuality
  });

  // 이미지나 미리보기 URL이 변경되면 상태 업데이트
  useEffect(() => {
    if (initialImage && initialPreviewUrl) {
      setShowCropper(false);
    }
  }, [initialImage, initialPreviewUrl]);

  // 이미지 적용 처리 함수
  const applyImage = async () => {
    try {
      const result = await handleApplyCrop();
      // 부모 컴포넌트로 크롭된 이미지 전달
      if (result.file) {
        onImageChange(result.file, result.previewUrl || undefined);
      }
    } catch (error) {
      console.error("이미지 크롭 실패:", error);
    }
  };

  // 비율 버튼 렌더링 함수
  const renderRatioButtons = () => {
    const ratioLabels: Record<AspectRatioOption, string> = {
      "1:1": "정사각형 (1:1)",
      "4:3": "가로 (4:3)",
      "3:4": "세로 (3:4)"
    };

    return (
      <div className="mb-4">
        <div className="flex flex-col space-y-4">
          {allowedAspectRatios.map((ratio) => (
            <button
              key={ratio}
              className={`px-5 py-2 rounded-md ${
                selectedRatio === ratio
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleRatioChange(ratio)}
            >
              {ratioLabels[ratio]}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 기본 미리보기 렌더링 함수
  const defaultRenderPreview = (previewUrl: string | null, handleButtonClick: () => void) => (
    <div className="relative w-full max-w-md h-64 flex items-center justify-center bg-gray-100">
      <img
        src={previewUrl || ''}
        alt="Preview"
        className="max-w-full max-h-full object-contain"
      />
      <button
        onClick={handleButtonClick}
        className="absolute z-10 bg-white text-blue-500 border border-blue-500 font-medium py-2 px-4 rounded bottom-4 right-4"
      >
        이미지 재업로드
      </button>
    </div>
  );

  // 기본 업로드 박스 렌더링 함수
  const defaultRenderUploadBox = (
    handleButtonClick: () => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  ) => (
    <div
      className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
      onClick={handleButtonClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center p-4">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          클릭하여 이미지를 선택하거나 파일을 여기로 드래그하세요
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {`이미지 크기는 ${minSize}KB ~ ${maxSize}MB 이내로 등록가능합니다.`}
        </p>
      </div>
    </div>
  );

  return (
    <div className="image-cropper">
      {/* 숨겨진 파일 입력 필드 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* 이미지 미리보기 또는 업로드 */}
      {!showCropper && (
        <>
          {previewUrl ? (
            renderPreview ? 
              renderPreview(previewUrl, handleButtonClick) : 
              defaultRenderPreview(previewUrl, handleButtonClick)
          ) : (
            renderUploadBox ? 
              renderUploadBox(handleButtonClick, handleDragOver, handleDrop) : 
              defaultRenderUploadBox(handleButtonClick, handleDragOver, handleDrop)
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </>
      )}

      {/* 이미지 크롭 모달 */}
      {showCropper && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${cropperClassName}`}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Crop className="mr-2" />
                <h3 className="text-xl font-bold">{modalTitle}</h3>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* 비율 선택 영역 */}
              <div className="md:w-1/4 mb-4 md:mb-0">
                {renderRatioButtons()}
              </div>

              {/* 크롭 영역 */}
              <div className="md:w-3/4">
                <div className="flex justify-center mb-6">
                  <div className="max-w-full" style={{ maxHeight: 'calc(70vh - 200px)' }}>
                    <ReactCrop
                      crop={crop}
                      onChange={(newCrop) => setCrop(newCrop as LibCrop)}
                      onComplete={handleCropComplete}
                      aspect={
                        selectedRatio === "1:1" ? 1 : 
                        selectedRatio === "4:3" ? 4/3 : 3/4
                      }
                      className="max-w-full"
                    >
                      <img
                        ref={imgRef}
                        src={previewUrl || ''}
                        alt="Crop Preview"
                        className="max-w-full max-h-full"
                        style={{ maxHeight: 'calc(70vh - 200px)' }}
                      />
                    </ReactCrop>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={applyImage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <Check size={16} className="mr-1" /> {applyButtonText}
                  </button>
                  <button
                    onClick={handleResetCrop}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <RefreshCcw size={16} className="mr-1" /> {resetButtonText}
                  </button>
                  <button
                    onClick={handleCancelCrop}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center"
                  >
                    <X size={16} className="mr-1" /> {cancelButtonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;