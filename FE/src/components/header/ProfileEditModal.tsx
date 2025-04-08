import React from 'react';
import { Camera, Check } from 'lucide-react';
import Modal from '../common/Modal/Modal';
import useProfileEditModal from '@/hooks/useProfileEditModal';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const {
    newUser,
    profileImage,
    phonePrefix,
    phoneMiddle,
    phoneSuffix,
    isLoading,
    errors,
    fileInputRef,
    handleInputChange,
    handleBlur,
    handleImageChange,
    triggerFileInput,
    onConfirm,
  } = useProfileEditModal(isOpen);

  const STYLES = {
    input:
      'px-2 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400',
    errorText: 'text-red-500 text-sm mt-1',
  };
  return (
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
              (YYYY-MM-DD)
            </span>
          </label>
          <input
            type="date"
            name="birth"
            value={newUser.birth || ''}
            onChange={handleInputChange}
            className={`${STYLES.input} w-full`}
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
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
  );
};

export default ProfileEditModal;
