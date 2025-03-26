import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, Calendar } from 'lucide-react';
import Modal from '../common/Modal/Modal';
import useUserStore from '@/stores/useUserStore';

import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useUserStore();
  const [newUser, setNewUser] = useState(user);
  const [profileImage, setProfileImage] = useState(user.profileUrl);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phonePrefix, setPhonePrefix] = useState('010');
  const [phoneMiddle, setPhoneMiddle] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    birth: '',
    phoneNumber: '',
  });
  const STYLES = {
    input:
      'px-2 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400',
    errorText: 'text-red-500 text-sm mt-1',
  };

  useEffect(() => {
    if (isOpen) {
      const parts = user.phoneNumber.split('-');
      setNewUser(user);
      setProfileImage(user.profileUrl);
      // 전화번호 분리
      setPhonePrefix(parts[0] || '010');
      setPhoneMiddle(parts[1] || '');
      setPhoneSuffix(parts[2] || '');
      // 생년월일 날짜 객체로 변환
      if (user.birth) {
        const [year, month, day] = user.birth.split('-').map(Number);
        setBirthDate(new Date(year, month - 1, day));
      } else {
        setBirthDate(null);
      }
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

  // 생년월일 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);

    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      // 현재 날짜와 비교 (미래 날짜 체크)
      if (date > today) {
        setErrors((prev) => ({
          ...prev,
          birth: '오늘 이후 날짜는 선택할 수 없습니다',
        }));
        return;
      }

      // 너무 오래된 날짜 체크 (예: 100년 이상 이전)
      const minDate = new Date(today);
      minDate.setFullYear(today.getFullYear() - 100);
      if (date < minDate) {
        setErrors((prev) => ({
          ...prev,
          birth: '유효하지 않은 생년월일입니다',
        }));
        return;
      }

      // 유효한 날짜면 상태 업데이트 및 에러 제거
      setErrors((prev) => ({
        ...prev,
        birth: '',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        birth: '유효한 생년월일을 입력해주세요',
      }));
    }
  };

  // 프로필 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = () => {
    setErrors((prev) => ({
      name: prev.name
        ? prev.name
        : !newUser.name?.trim()
          ? '이름을 입력해주세요'
          : newUser.name.trim().length > 10
            ? '이름은 최대 10자까지 입력 가능합니다'
            : '',
      birth: prev.birth
        ? prev.birth
        : !birthDate
          ? '유효한 생년월일을 입력해주세요'
          : '',
      phoneNumber: prev.phoneNumber
        ? prev.phoneNumber
        : !phoneMiddle || !phoneSuffix
          ? '전화번호를 입력해주세요'
          : phoneMiddle.length !== 4 || phoneSuffix.length !== 4
            ? '전화번호 형식이 올바르지 않습니다'
            : '',
    }));

    // 에러 메시지가 하나라도 있으면 요청을 보내지 않음
    if (Object.values(errors).some((error) => error !== '')) {
      return false;
    }

    // 프로필 업데이트
    const phoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneSuffix}`;
    const birth = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;

    // axios 요청

    updateUser({
      ...newUser,
      phoneNumber: phoneNumber,
      profileUrl: profileImage,
      birth: birth,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="프로필 수정"
      confirmButtonText="저장하기"
      cancelButtonText="취소하기"
      onConfirm={onConfirm}>
      <>
        <div className="w-full px-5 flex flex-col justify-center space-y-4">
          {/* 프로필 이미지 */}
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
            <div className=" relative rounded-full border-4 border-white shadow-md transition-all duration-300 hover:border-blue-300">
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

          {/* 이름 입력 */}
          <div className="flex flex-col space-y-1">
            <label>
              이름(별명)
              <span className="text-gray-500 text-subtitle-2-lg pl-1">
                (최소 1자~최대 10자)
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={newUser?.name || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`${STYLES.input} w-full`}
              placeholder="이름(별명)을 입력해주세요."
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
            <DatePicker
              selected={birthDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜를 입력해주세요"
              className={`${STYLES.input} w-full`}
              maxDate={new Date()}
              locale={ko}
              open={false}
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
    </Modal>
  );
};

export default ProfileEditModal;
