import React from 'react';
import { Upload } from 'lucide-react';
import ImageCropper from '@/components/common/ImageCrop/ImageCropper';

interface InputPicProps {
  onImageChange: (file: File | null, previewUrl?: string) => void;
  imageError?: string;
  initialImage?: File | null;
  initialPreviewUrl?: string | null;
}

function InputPic({ onImageChange, imageError, initialImage = null, initialPreviewUrl = null }: InputPicProps) {
  // 프로필 이미지 미리보기 커스텀 렌더링 함수
  const renderProfilePreview = (previewUrl: string | null, handleButtonClick: () => void) => (
    <div className="relative w-40 h-40">
      <img
        src={previewUrl || ''}
        alt="Profile Preview"
        className="w-40 h-40 rounded-full object-cover border-4"
      />
      {/* 업로드 버튼 */}
      <div
        className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        onClick={handleButtonClick}
      >
        <Upload size={16} className="text-white" />
      </div>
    </div>
  );

  // 업로드 영역 커스텀 렌더링 함수
  const renderUploadBox = (
    handleButtonClick: () => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  ) => (
    <div
      className="w-40 h-40 rounded-full border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleButtonClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload size={32} className="text-gray-600 mb-2" />
      <p className="text-sm text-gray-600">클릭하거나 드래그</p>
    </div>
  );

  // 이미지 변경 핸들러 (이미지 크로퍼로부터 결과 수신)
  const handleImageChangeFromCropper = (file: File | null, previewUrl?: string) => {
    // 부모 컴포넌트에 변경된 이미지 정보 전달
    onImageChange(file, previewUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 h-[300px]">
      <ImageCropper
        onImageChange={handleImageChangeFromCropper}
        initialImage={initialImage}
        initialPreviewUrl={initialPreviewUrl}
        allowedAspectRatios={["1:1"]} // 프로필은 1:1 비율만 사용
        defaultAspectRatio="1:1"
        minSize={100} // 최소 100KB
        maxSize={3}   // 최대 3MB
        imageQuality={1.0} // 최대 품질
        renderPreview={renderProfilePreview}
        renderUploadBox={renderUploadBox}
        modalTitle="이미지 크롭"
        applyButtonText="적용"
        resetButtonText="초기화"
        cancelButtonText="취소"
        cropperClassName="top-[37px]" // 기존 top 위치 유지
      />
      
      {/* 프로필 사진 설명 */}
      <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-2">프로필 사진을 통해 본인을 표현해 주세요</p>
      
      {/* 이미지 오류 메시지 */}
      {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
    </div>
  );
}

export default InputPic;