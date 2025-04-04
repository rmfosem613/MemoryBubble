import React, { useState, useRef } from 'react';
import ImageCropper from '@/components/common/ImageCrop/ImageCropper';

interface CroppableInputImgProps {
  onImagesSelected: (images: { file: File; preview: string }[]) => void;
}

function CroppableInputImg({ onImagesSelected }: CroppableInputImgProps) {
  // 선택된 이미지 배열 상태
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  // 현재 크롭 중인 이미지 인덱스 (-1은 크롭 중이 아님)
  const [croppingIndex, setCroppingIndex] = useState<number>(-1);
  // 현재 크롭 중인 이미지 파일
  const [currentCropFile, setCurrentCropFile] = useState<File | null>(null);
  // 현재 크롭 중인 이미지 미리보기 URL
  const [currentCropPreview, setCurrentCropPreview] = useState<string | null>(null);
  
  // 이미지 추가 버튼 클릭
  const handleAddImageClick = () => {
    if (selectedImages.length >= 5) {
      alert('사진은 최대 5장까지 추가할 수 있습니다.');
      return;
    }

    // 새 이미지 크롭 시작
    setCroppingIndex(-2); // -2는 새 이미지 추가 모드
    setCurrentCropFile(null);
    setCurrentCropPreview(null);
  };

  // 이미지 편집 (재크롭) 클릭
  const handleEditImage = (index: number) => {
    setCroppingIndex(index);
    setCurrentCropFile(selectedImages[index].file);
    setCurrentCropPreview(selectedImages[index].preview);
  };

  // 이미지 삭제 핸들러
  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const updated = [...prev];
      // 미리보기 URL 해제
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      
      // 부모 컴포넌트에 업데이트된 이미지 배열 전달
      onImagesSelected(updated);
      
      return updated;
    });
  };

  // ImageCropper에서 이미지 변경 완료 시 호출
  const handleImageChange = (file: File | null, previewUrl?: string) => {
    if (!file || !previewUrl) return;

    if (croppingIndex === -2) {
      // 새 이미지 추가
      const newImage = {
        file,
        preview: previewUrl
      };
      
      const updatedImages = [...selectedImages, newImage];
      setSelectedImages(updatedImages);
      onImagesSelected(updatedImages);
    } else if (croppingIndex >= 0) {
      // 기존 이미지 수정
      const updatedImages = [...selectedImages];
      // 이전 미리보기 URL 해제
      URL.revokeObjectURL(updatedImages[croppingIndex].preview);
      
      updatedImages[croppingIndex] = {
        file,
        preview: previewUrl
      };
      
      setSelectedImages(updatedImages);
      onImagesSelected(updatedImages);
    }
    
    // 크롭 모드 종료
    setCroppingIndex(-1);
  };

  // 크롭 취소 처리
  const handleCropCancel = () => {
    setCroppingIndex(-1);
  };

  // 이미지 미리보기 렌더링 함수
  const renderPreview = (previewUrl: string | null, handleButtonClick: () => void) => (
    <div className="relative w-full h-full">
      <img
        src={previewUrl || ''}
        alt="Preview"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );

  // 업로드 영역 렌더링 함수
  const renderUploadBox = (
    handleButtonClick: () => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  ) => (
    <div
      className="w-full h-full min-w-[100px] min-h-[100px] border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 rounded-md"
      onClick={handleButtonClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
    </div>
  );

  return (
    <div className="w-full mb-4">
      {/* 이미지 크로퍼 모달 */}
      {croppingIndex !== -1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-[90%] max-h-[90vh] overflow-auto">
            <ImageCropper
              onImageChange={handleImageChange}
              initialImage={currentCropFile}
              initialPreviewUrl={currentCropPreview}
              allowedAspectRatios={["4:3"]} // 모든 이미지를 4:3으로 통일
              defaultAspectRatio="4:3"
              minSize={100} // 최소 100KB
              maxSize={3}   // 최대 3MB
              imageQuality={0.9}
              renderPreview={renderPreview}
              renderUploadBox={renderUploadBox}
              modalTitle="이미지 자르기"
              applyButtonText="적용"
              resetButtonText="초기화"
              cancelButtonText="취소"
              cropperClassName=""
            />
            
            <div className="flex justify-center mt-4">
              <button 
                onClick={handleCropCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 미리보기 영역 */}
      <div className="flex overflow-x-auto space-x-2 mb-2 pb-2">
        {/* 이미지 추가 버튼 */}
        <div
          className="min-w-[100px] h-[100px] flex-shrink-0 flex flex-col items-center justify-center border border-gray-300 rounded-md cursor-pointer bg-gray-50"
          onClick={handleAddImageClick}
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
        </div>

        {/* 선택된 이미지 미리보기 */}
        {selectedImages.map((image, index) => (
          <div key={index} className="relative min-w-[100px] h-[100px] flex-shrink-0">
            <img
              src={image.preview}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all rounded-md">
              <button
                className="opacity-0 hover:opacity-100 bg-white rounded-full p-1 mx-1"
                onClick={() => handleEditImage(index)}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
            <button
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => removeImage(index)}
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
  );
}

export default CroppableInputImg;