import React from 'react';
import { Camera, Check, Upload } from 'lucide-react';
import Modal from '../common/Modal/Modal';
import useProfileEditModal from '@/hooks/useProfileEditModal';
import Alert from '../common/Alert';
import ImageCropper from '../common/ImageCrop/ImageCropper';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const {
    newUser,
    profileImage,
    profileFile,
    phonePrefix,
    phoneMiddle,
    phoneSuffix,
    isLoading,
    errors,
    customAlert,
    todayStr,
    handleInputChange,
    handleBlur,
    handleImageChange,
    onConfirm,
  } = useProfileEditModal(isOpen);

  // 프로필 이미지 미리보기 커스텀 렌더링 함수
  const renderProfilePreview = (
    previewUrl: string | null,
    handleButtonClick: () => void,
  ) => (
    <div className="relative w-40 h-40">
      <img
        src={previewUrl || ''}
        alt="Profile Preview"
        className="w-40 h-40 rounded-full object-cover border-4"
      />
      {/* 업로드 버튼 */}
      <div
        className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        onClick={handleButtonClick}>
        <Upload size={16} className="text-white" />
      </div>
    </div>
  );

  // 업로드 영역 커스텀 렌더링 함수
  const renderUploadBox = (
    handleButtonClick: () => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void,
  ) => (
    <div
      className="w-40 h-40 rounded-full border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
      onClick={handleButtonClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      <Upload size={32} className="text-gray-600 mb-2" />
      <p className="text-sm text-gray-600">클릭하거나 드래그</p>
    </div>
  );

  const STYLES = {
    input:
      'px-2 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400',
    errorText: 'text-red-500 text-sm mt-1',
  };
  return (
    <>
      {customAlert.show && (
        <Alert message={customAlert.message} color={customAlert.color} />
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="프로필 수정"
        confirmButtonText={isLoading ? '저장 중...' : '저장하기'}
        cancelButtonText="취소하기"
        onConfirm={onConfirm}>
        <div className="w-full px-5 flex flex-col justify-center space-y-4">
          {/* 프로필 이미지 */}
          {/* <div className="mx-auto" onClick={triggerFileInput}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div className="relative rounded-full border-4 border-white shadow-md transition-all duration-300 hover:border-blue-300 cursor-pointer">
            <img
              src={profileImage}
              alt="프로필 이미지"
              className="w-28 h-28 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md">
              <Camera size={18} />
            </div>
          </div>
        </div> */}

          <div className="mb-5 flex flex-col gap-2">
            <p className="mb-2">프로필 이미지</p>
            <p className="text-xs text-gray-500 text-center">
              이미지 크기는 100KB ~ 10MB 이내로 등록가능합니다.
            </p>

            <ImageCropper
              onImageChange={handleImageChange}
              initialImage={profileFile}
              initialPreviewUrl={profileImage}
              allowedAspectRatios={['1:1']} // 프로필은 1:1 비율만 사용
              defaultAspectRatio="1:1"
              renderPreview={renderProfilePreview}
              renderUploadBox={renderUploadBox}
            />
          </div>

          {/* 이름 입력 */}
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <label>
                이름(별명)
                <span className="text-gray-500 text-subtitle-2-lg pl-1">
                  (최소 1자~최대 10자)
                </span>
              </label>
              <p className="text-gray-600 text-sm">
                {newUser?.name?.length || 0}/10
              </p>
            </div>
            <input
              type="text"
              name="name"
              value={newUser?.name || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`${STYLES.input} w-full`}
              placeholder="이름(별명)을 입력해주세요."
              maxLength={10}
            />
            {errors.name && <p className={STYLES.errorText}>{errors.name}</p>}
          </div>

          {/* 생년월일 입력 */}
          <div className="flex flex-col space-y-1">
            <label>
              생년월일
              <span className="text-gray-500 text-subtitle-2-lg pl-1">
                (1900-01-01 ~ {todayStr})
              </span>
            </label>
            <input
              type="date"
              name="birth"
              value={newUser.birth || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`${STYLES.input} w-full`}
              min="1900-01-01"
              max={todayStr}
            />
            {errors.birth && <p className={STYLES.errorText}>{errors.birth}</p>}
          </div>

          {/* 전화번호 입력 */}
          <div className="flex flex-col space-y-1">
            <label>전화번호</label>
            <div className="flex items-center space-x-2">
              <select
                name="phonePrefix"
                value={phonePrefix}
                onChange={handleInputChange}
                className={`${STYLES.input} w-1/3`}>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span>-</span>
              <input
                type="text"
                name="phoneMiddle"
                value={phoneMiddle}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${STYLES.input} w-1/3`}
                maxLength={4}
                placeholder="0000"
              />
              <span>-</span>
              <input
                type="text"
                name="phoneSuffix"
                value={phoneSuffix}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${STYLES.input} w-1/3`}
                maxLength={4}
                placeholder="0000"
              />
            </div>
            {errors.phoneNumber && (
              <p className={STYLES.errorText}>{errors.phoneNumber}</p>
            )}
          </div>

          {/* 성별 선택 */}
          <div className="flex flex-col space-y-1">
            <label>성별</label>
            <div className="flex space-x-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={newUser?.gender === 'F'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border text-white ${newUser?.gender === 'F' ? 'bg-blue-500' : ''} flex items-center justify-center`}>
                  {newUser?.gender === 'F' && <Check size={12} />}
                </div>
                <span>여자</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={newUser?.gender === 'M'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border text-white ${newUser?.gender === 'M' ? 'bg-blue-500' : ''} flex items-center justify-center`}>
                  {newUser?.gender === 'M' && <Check size={12} />}
                </div>
                <span>남자</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileEditModal;
