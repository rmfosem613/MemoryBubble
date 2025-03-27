import React from 'react';

interface PhotoModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photoUrl, onClose }) => {
  if (!photoUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-screen p-4">
        <img
          src={photoUrl}
          alt="Enlarged photo"
          className="max-w-full max-h-full object-contain"
        />
        <button
          className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PhotoModal;