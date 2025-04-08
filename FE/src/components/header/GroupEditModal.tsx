import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import { useGroupEditModal } from '@/hooks/useGroupEditModal';

interface GroupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupEditModal = ({ isOpen, onClose }: GroupEditModalProps) => {
  const {
    groupName,
    thumbnailPreview,
    errorMessage,
    isLoading,
    fileInputRef,
    handleInputChange,
    handleGroupNameBlur,
    handleImageClick,
    handleFileChange,
    onConfirm,
  } = useGroupEditModal(isOpen);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="그룹 수정"
      confirmButtonText={isLoading ? '저장 중...' : '저장하기'}
      cancelButtonText="취소하기"
      onConfirm={onConfirm}>
      <>
        {/* 썸네일 이미지 */}
        {/* <div className="mb-5">
          <p className="mb-2">그룹 대표 이미지</p>
          <div className="flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <div
              className="h-36 mb-2 border-4 overflow-hidden border-white shadow-md transition-all duration-300 hover:border-blue-300 cursor-pointer"
              onClick={handleImageClick}>
              <img
                src={thumbnailPreview}
                alt="그룹 썸네일"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleImageClick}
              className="px-3 py-1 bg-blue-200 rounded-md hover:bg-blue-300 text-sm"
              disabled={isLoading}>
              이미지 변경
            </button>
          </div>
        </div> */}

        {/* 그룹명 */}
        <div className="mb-4">
          <div className="flex justify-between">
            <p className="mb-1">
              그룹명
              <span className="p-1 text-sm text-gray-600">
                (최소 1자 ~ 최대 10자)
              </span>
            </p>
            <p className="text-gray-600 mb-1 text-sm">{groupName.length}/10</p>
          </div>
          <input
            type="text"
            value={groupName}
            onChange={handleInputChange}
            onBlur={handleGroupNameBlur}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="그룹명을 입력해주세요."
            maxLength={10}
            disabled={isLoading}
          />
          {errorMessage && (
            <p className="text-red-500 mt-1 text-sm">{errorMessage}</p>
          )}
        </div>
      </>
    </Modal>
  );
};

export default GroupEditModal;
