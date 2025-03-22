import React, { useState, useRef } from 'react';

function InputImg() {
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  // 이미지 선택 핸들러
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // 최대 5개 이미지만 허용
    if (selectedImages.length + files.length > 5) {
      alert('사진은 최대 5장까지 추가할 수 있습니다.');
      return;
    }

    // 이미지 파일 미리보기 URL 생성
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file as Blob)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  // 이미지 삭제 핸들러
  const removeImage = (index) => {
    setSelectedImages(prev => {
      const updated = [...prev];
      // 미리보기 URL 해제
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // 이미지 업로드 트리거
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full mb-4">
      {/* 이미지 미리보기 영역 */}
      <div className="flex overflow-x-auto space-x-2 mb-2 pb-2">
        {/* 이미지 추가 버튼 */}
        <div
          className="min-w-[100px] h-[100px] flex-shrink-0 flex flex-col items-center justify-center border border-gray-300 rounded-md cursor-pointer bg-gray-50"
          onClick={triggerFileInput}
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
            <button
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => removeImage(index)}
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

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleImageSelect}
      />
    </div>
  );
}

export default InputImg;