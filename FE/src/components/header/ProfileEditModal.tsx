import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check } from 'lucide-react';
import Modal from '../common/Modal/Modal';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useUserStore();
  const { updateUserProfile, uploadImageWithPresignedUrl } = useUserApi();

  const [newUser, setNewUser] = useState(user);
  const [profileImage, setProfileImage] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [phonePrefix, setPhonePrefix] = useState('010');
  const [phoneMiddle, setPhoneMiddle] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    image: '',
    name: '',
    birth: '',
    phoneNumber: '',
    api: '',
  });
  const STYLES = {
    input:
      'px-2 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400',
    errorText: 'text-red-500 text-sm mt-1',
  };

  useEffect(() => {
    if (isOpen) {
      const parts = user.phoneNumber?.split('-') || ['010', '', ''];
      setNewUser(user);
      setProfileImage(user.profileUrl);
      // 전화번호 분리
      setPhonePrefix(parts[0] || '010');
      setPhoneMiddle(parts[1] || '');
      setPhoneSuffix(parts[2] || '');
    }
  }, [isOpen, user]);

  // 입력 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // 필드에 따라 다른 상태 업데이트
    if (name === 'phonePrefix') {
      setPhonePrefix(value);
    } else if (name === 'phoneMiddle') {
      // 숫자만 입력 가능하도록
      if (/^\d*$/.test(value)) {
        setPhoneMiddle(value);
      }
    } else if (name === 'phoneSuffix') {
      // 숫자만 입력 가능하도록
      if (/^\d*$/.test(value)) {
        setPhoneSuffix(value);
      }
    } else if (name === 'birth') {
      setNewUser((prev) => ({
        ...prev,
        birth: value,
      }));
      setErrors((prev) => ({
        ...prev,
        birth: value ? '' : '생년월일을 입력해주세요',
      }));
    } else {
      // 일반 필드는 newUser 객체에 직접 업데이트
      setNewUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // 필드에 따라 다른 유효성 검사
    if (name === 'phoneMiddle' || name === 'phoneSuffix') {
      if (!phoneMiddle || !phoneSuffix) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: '전화번호를 입력해주세요',
        }));
      } else if (phoneMiddle.length !== 4 || phoneSuffix.length !== 4) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: '전화번호 형식이 올바르지 않습니다',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: '',
        }));
      }
    } else if (name === 'name') {
      setNewUser((prev) => ({
        ...prev,
        name: value.trim(),
      }));
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          name: '이름을 입력해주세요',
        }));
      } else if (value.trim().length > 10) {
        setErrors((prev) => ({
          ...prev,
          name: '최대 10자까지 입력 가능합니다',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          name: '',
        }));
      }
    }
  };

  // 프로필 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors((prev) => ({
          ...prev,
          image: '이미지 파일만 업로드 가능합니다.',
        }));
        return;
      }
      setProfileFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({
        ...prev,
        image: '',
      }));
    }
  };

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = async () => {
    // 유효성 검사
    const validationErrors = {
      image: '',
      name: !newUser.name?.trim()
        ? '이름을 입력해주세요'
        : newUser.name.trim().length > 10
          ? '이름은 최대 10자까지 입력 가능합니다'
          : '',
      birth: !newUser.birth ? '생년월일을 입력해주세요' : '',
      phoneNumber:
        !phoneMiddle || !phoneSuffix
          ? '전화번호를 입력해주세요'
          : phoneMiddle.length !== 4 || phoneSuffix.length !== 4
            ? '전화번호 형식이 올바르지 않습니다'
            : '',
      api: '',
    };

    setErrors(validationErrors);

    // 에러 메시지가 하나라도 있으면 요청을 보내지 않음
    if (Object.values(validationErrors).some((error) => error !== '')) {
      return false;
    }

    // 프로필 업데이트
    const phoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneSuffix}`;

    // 변경된 필드만 포함하는 updateData 객체 생성
    const updateData: {
      name?: string;
      birth?: string;
      phoneNumber?: string;
      gender?: 'M' | 'F';
    } = {};

    // 변경된 필드만 추가
    if (user.name !== newUser.name) {
      updateData.name = newUser.name;
    }
    if (user.birth !== newUser.birth) {
      updateData.birth = newUser.birth;
    }
    if (user.phoneNumber !== phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }
    if (user.gender !== newUser.gender) {
      updateData.gender = newUser.gender;
    }

    // 변경사항이 없고 이미지도 변경되지 않았으면 API 호출 없이 모달 닫기
    if (Object.keys(updateData).length === 0 && !profileFile) {
      return true;
    }

    try {
      setIsLoading(true);

      if (user.userId) {
        // 프로필 정보가 변경되었거나 이미지가 변경된 경우 API 요청
        if (Object.keys(updateData).length > 0 || profileFile) {
          // 이미지만 변경된 경우에도 최소한 한 필드는 필요할 수 있으므로 name 추가
          if (Object.keys(updateData).length === 0 && profileFile) {
            updateData.name = newUser.name;
          }

          const response = await updateUserProfile(user.userId, updateData);
          if (response.status === 200) {
            setUser(updateData);
            // 이미지 업로드 처리
            if (profileFile && response.data.presignedUrl) {
              try {
                await uploadImageWithPresignedUrl(
                  response.data.presignedUrl,
                  profileFile,
                );
                setUser({
                  profileUrl: profileImage,
                });
              } catch (uploadError) {
                console.error('프로필 이미지 업로드 실패:', uploadError);
                setErrors((prev) => ({
                  ...prev,
                  api: '이미지 업로드 중 오류가 발생했습니다.',
                }));
                return false;
              }
            }

            return true; // 모달 닫기
          } else {
            setErrors((prev) => ({
              ...prev,
              api: '프로필 정보 업데이트 중 오류가 발생했습니다.',
            }));
            return false;
          }
        }

        return true; // 변경사항이 없으면 모달 닫기
      }

      setErrors((prev) => ({
        ...prev,
        api: '사용자 ID가 없습니다.',
      }));
      return false;
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      setErrors((prev) => ({
        ...prev,
        api: '프로필 정보 업데이트 중 오류가 발생했습니다.',
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="프로필 수정"
      confirmButtonText={isLoading ? '저장 중...' : '저장하기'}
      cancelButtonText="취소하기"
      onConfirm={onConfirm}>
      <>
        <div className="w-full px-5 flex flex-col justify-center space-y-4">
          {/* 프로필 이미지 */}
          <>
            <div
              className="mx-auto"
              onClick={() => fileInputRef.current?.click()}>
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
            </div>
            {errors.image && (
              <p className={`text-center ${STYLES.errorText}`}>
                {errors.image}
              </p>
            )}
          </>

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
      </>
      {errors.api && (
        <p className="text-red-500 text-sm mt-1 text-center">{errors.api}</p>
      )}
    </Modal>
  );
};

export default ProfileEditModal;
