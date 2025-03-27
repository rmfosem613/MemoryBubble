import React from 'react';
import { CircleCheck, CirclePlus, FolderUp, ImageUp, X } from 'lucide-react';

type ActionMode = 'normal' | 'selection' | 'thumbnail';

interface PhotoActionBarProps {
  mode: ActionMode;
  onToggleSelectionMode: () => void;
  onEnterThumbnailMode: () => void;
  onCancelMode: () => void;
  onAddPhoto: () => void;
  onMovePhotos?: () => void;
  selectionCount?: number;
}

const PhotoActionBar: React.FC<PhotoActionBarProps> = ({
  mode,
  onToggleSelectionMode,
  onEnterThumbnailMode,
  onCancelMode,
  onAddPhoto,
  onMovePhotos,
  selectionCount = 0
}) => {
  const renderSelectionMessage = () => {
    if (mode !== 'selection') return null;

    if (selectionCount === 0) {
      return (
        <p className="text-red-200 font-p-500 text-subtitle-1-lg">
          사진을 선택해주세요
        </p>
      );
    } else {
      return (
        <p className="text-red-200 font-p-500 text-subtitle-1-lg">
          사진 <span className="font-bold">{selectionCount}</span>장이 선택되었습니다.
        </p>
      );
    }
  };

  const renderThumbnailMessage = () => {
    if (mode !== 'thumbnail') return null;

    return (
      <p className="text-red-200 font-p-500 text-subtitle-1-lg">
        대표 이미지로 설정할 사진을 선택해주세요.
      </p>
    );
  };

  return (
    <div>
      <div className="flex space-x-5 justify-end">
        {mode === 'normal' ? (
          <>
            {/* 일반 모드 버튼들 */}
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={onToggleSelectionMode}
            >
              <CircleCheck strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'21px'} />
              <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-300"></div>
              <p className="font-p-500 text-subtitle-1-lg">선택하기</p>
            </div>
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={onEnterThumbnailMode}
            >
              <ImageUp strokeWidth={1} className="absolute z-30 ml-[-4px] mt-[2px]" size={'21px'} />
              <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-300"></div>
              <p className="font-p-500 text-subtitle-1-lg">썸네일 변경</p>
            </div>
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={onAddPhoto}
            >
              <CirclePlus strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'21px'} />
              <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-album-200"></div>
              <p className="font-p-500 text-subtitle-1-lg">사진 추가</p>
            </div>
          </>
        ) : mode === 'selection' ? (
          <>
            {/* 선택 모드 버튼들 */}
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={onCancelMode}
            >
              <X strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'23px'} />
              <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-400"></div>
              <p className="font-p-500 text-subtitle-1-lg">취소하기</p>
            </div>
            {onMovePhotos && (
              <div
                className="flex space-x-1 cursor-pointer"
                onClick={onMovePhotos}
              >
                <FolderUp strokeWidth={1} className="absolute z-30 ml-[-5pX] mt-[2px]" size={'22px'} />
                <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-400"></div>
                <p className="font-p-500 text-subtitle-1-lg">앨범 이동하기</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 썸네일 모드 버튼들 */}
            <div
              className="flex space-x-1 cursor-pointer"
              onClick={onCancelMode}
            >
              <X strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'23px'} />
              <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-400"></div>
              <p className="font-p-500 text-subtitle-1-lg">취소하기</p>
            </div>
            <div className="flex space-x-1">
              <ImageUp strokeWidth={1} className="absolute z-30 ml-[-4px] mt-[2px]" size={'21px'} />
              <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-300"></div>
              <p className="font-p-500 text-subtitle-1-lg">썸네일 변경</p>
            </div>
          </>
        )}
      </div>
      
      {mode === 'selection' && renderSelectionMessage()}
      {mode === 'thumbnail' && renderThumbnailMessage()}
      {mode === 'normal' && <p className="text-transparent h-[24px] text-subtitle-1-lg"></p>}
    </div>
  );
};

export default PhotoActionBar;