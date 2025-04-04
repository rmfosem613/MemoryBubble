import React from 'react'
import ImageCropper from '@/components/common/ImageCrop/ImageCropper'
import { Upload } from 'lucide-react'

interface InputGroupPicProps {
  onImageChange: (file: File | null, previewUrl?: string) => void;
  initialImage?: File | null;
  initialPreviewUrl?: string | null;
}

function InputGroupPic({ onImageChange, initialImage = null, initialPreviewUrl = null }: InputGroupPicProps) {
  // 그룹 이미지 미리보기 커스텀 렌더링 함수
  const renderGroupPreview = (previewUrl: string | null, handleButtonClick: () => void) => (
    <div className="relative w-[400px] h-[300px] flex items-center justify-center bg-gray-100">
      <img
        src={previewUrl || ''}
        alt="Group Preview"
        className="max-w-full max-h-full object-contain"
        style={{ maxHeight: '300px' }}
      />
      <button
        onClick={handleButtonClick}
        className="absolute z-50 bg-blue-500 text-white font-p-500 py-2 px-3 rounded-[8px] bottom-[10px] right-[10px]"
      >
        {/* 이미지 재업로드 */}
        <Upload width={"20px"}/>
      </button>
    </div>
  )

  // 업로드 영역 커스텀 렌더링 함수
  const renderUploadBox = (
    handleButtonClick: () => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  ) => (
    <div
      className="w-[370px] h-[260px] mt-[10px] border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleButtonClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload size={32} className="text-gray-600 mb-2" />
      <p className="text-sm text-gray-600">클릭하거나 드래그</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <ImageCropper
        onImageChange={onImageChange}
        initialImage={initialImage}
        initialPreviewUrl={initialPreviewUrl}
        allowedAspectRatios={["4:3", "3:4", "1:1"]} // 그룹 이미지는 4:3, 3:4 비율 허용
        defaultAspectRatio="4:3" // 초기 crop 비율
        minSize={100} // 최소 100KB
        maxSize={3}   // 최대 3MB
        imageQuality={1.0} // 최대 품질
        renderPreview={renderGroupPreview}
        renderUploadBox={renderUploadBox}
        cropperClassName="top-[67px]" // 기존 top 위치 유지
        // 아래부터 이름 변경 가능
        modalTitle="이미지 자르기" 
        applyButtonText="적용"
        resetButtonText="초기화"
        cancelButtonText="취소"
      />
    </div>
  )
}

export default InputGroupPic