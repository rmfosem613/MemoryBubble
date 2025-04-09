import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";

interface PhotoModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

function PhotoModal({ photoUrl, onClose }: PhotoModalProps) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  
  // Reset state when modal reopens with new image
  useEffect(() => {
    if (photoUrl) {
      setIsHighResLoaded(false);
      setShowLoadingIndicator(true);
    }
  }, [photoUrl]);

  if (!photoUrl) return null;

  // 저화질 이미지 URL (썸네일 크기)
  const lowResUrl = `${photoUrl}&w=50`;
  // 고화질 이미지 URL
  const highResUrl = `${photoUrl}&w=1200`;

  const handleHighResImageLoad = () => {
    setIsHighResLoaded(true);
    setShowLoadingIndicator(false);
  };

  const handleLowResImageLoad = () => {
    // 저화질 이미지가 로드되면 로딩 인디케이터 숨기기
    setShowLoadingIndicator(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-[90%] h-[66%] lg:w-[60%] sm:h-[80%] p-4 flex items-center justify-center">
        <div className='absolute w-full h-full bg-white p-2'>
          {/* 저화질 이미지 (고화질 이미지 로드 전까지 표시) */}
          <img
            src={lowResUrl}
            alt="Preview photo"
            className={`w-full h-full object-contain ${isHighResLoaded ? 'opacity-0 absolute' : 'opacity-100'}`}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onLoad={handleLowResImageLoad}
          />
          
          {/* 고화질 이미지 (로드 후 표시) */}
          <img
            src={highResUrl}
            alt="Enlarged photo"
            className={`w-full h-full object-contain ${isHighResLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onLoad={handleHighResImageLoad}
          />
          
          {/* 닫기 버튼 */}
          <button
            className="absolute top-3 right-3 text-blue-500 flex items-center justify-center z-10"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X strokeWidth={4} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;