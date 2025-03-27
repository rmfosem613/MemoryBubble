import React from 'react';
import InfiniteScroll from "@/components/photo/InfiniteScroll";

interface Photo {
  photoId: number;
  photoUrl: string;
}

interface PhotoGridProps {
  photos: Photo[];
  selectedPhotoIndices: number[];
  isSelectionMode: boolean;
  isThumbnailMode: boolean;
  onPhotoClick: (photo: Photo, index: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

function PhotoGrid({
  photos,
  selectedPhotoIndices,
  isSelectionMode,
  isThumbnailMode,
  onPhotoClick,
  onLoadMore,
  hasMore
}: PhotoGridProps) {
  // InfiniteScroll 컴포넌트를 위한 renderItem 함수
  const renderPhoto = (photo: Photo, index: number) => (
    <div
      className={`relative aspect-square overflow-hidden cursor-pointer 
        ${selectedPhotoIndices.includes(index) ? 'ring-4 ring-blue-500' : ''}
        ${isThumbnailMode ? 'hover:ring-2 hover:ring-blue-300' : ''}
      `}
      onClick={() => onPhotoClick(photo, index)}
    >
      <img
        src={photo.photoUrl}
        alt={`Photo ${index + 1}`}
        className="w-full h-full object-cover"
      />
      {isSelectionMode && selectedPhotoIndices.includes(index) && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
          ✓
        </div>
      )}
    </div>
  );

  return (
    <InfiniteScroll
      items={photos}
      renderItem={renderPhoto}
      loadMoreItems={onLoadMore}
      hasMore={hasMore}
    />
  );
};

export default PhotoGrid;