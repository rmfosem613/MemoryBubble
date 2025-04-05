import React from 'react';
import { X } from "lucide-react";

interface PhotoModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

function PhotoModal({ photoUrl, onClose }: PhotoModalProps) {
  if (!photoUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-[90%] h-[66%] lg:w-[60%] sm:h-[80%] p-4 flex items-center justify-center">
        <div className='absolute w-full h-full bg-white p-2'>
          <img
            src={photoUrl}
            alt="Enlarged photo"
            className="w-full h-full object-contain"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
          <button
            className="absolute top-3 right-3 text-blue-500 flex items-center justify-center"
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