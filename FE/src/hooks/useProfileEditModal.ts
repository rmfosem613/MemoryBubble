import { useState, useEffect, useRef } from 'react';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';
import { User } from '@/stores/useUserStore';

interface ProfileFormErrors {
  name: string;
  birth: string;
  phoneNumber: string;
  image?: string;
}

export const useProfileEditModal = (isOpen: boolean) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useUserStore();
  const { updateUserProfile, uploadImageWithPresignedUrl } = useUserApi();

  const [newUser, setNewUser] = useState<User>(user);
  const [profileImage, setProfileImage] = useState<string>('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [phonePrefix, setPhonePrefix] = useState<string>('010');
  const [phoneMiddle, setPhoneMiddle] = useState<string>('');
  const [phoneSuffix, setPhoneSuffix] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ProfileFormErrors>({
    name: '',
    birth: '',
    phoneNumber: '',
  });

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      const parts = user.phoneNumber?.split('-') || ['010', '', ''];
      setNewUser(user);
      setProfileImage(user.profileUrl || '');
      // 전화번호 분리
      setPhonePrefix(parts[0] || '010');
      setPhoneMiddle(parts[1] || '');
      setPhoneSuffix(parts[2] || '');
      // 에러 초기화
      setErrors({
        name: '',
        birth: '',
        phoneNumber: '',
      });
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
        alert('이미지 파일만 업로드 가능합니다.');
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

  // 이미지 업로드 트리거
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = async () => {
    // 에러 메시지가 하나라도 있으면 요청을 보내지 않음
    if (Object.values(errors).some((error) => error !== '')) {
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
      updateData.name = newUser.name || null;
    }
    if (user.birth !== newUser.birth) {
      updateData.birth = newUser.birth || null;
    }
    if (user.phoneNumber !== phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }
    if (user.gender !== newUser.gender) {
      updateData.gender = newUser.gender as 'M' | 'F' | null;
    }

    // 변경사항이 없고 이미지도 변경되지 않았으면 API 호출 없이 모달 닫기
    if (Object.keys(updateData).length === 0 && !profileFile) {
      return true;
    }

    try {
      setIsLoading(true);

      // 프로필 정보가 변경되었거나 이미지가 변경된 경우 API 요청
      if (Object.keys(updateData).length > 0 || profileFile) {
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
              alert('프로필은 수정되었으나, 이미지 수정에 실패했습니다.');
              return false;
            }
          }

          alert('프로필 정보가 수정되었습니다. ');
          return true; // 모달 닫기
        } else {
          alert('프로필 정보 수정 중 오류가 발생했습니다. ');
          return false;
        }
      }
      return true; // 변경사항이 없으면 모달 닫기
    } catch (error) {
      alert('프로필 정보 수정 중 오류가 발생했습니다. ');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};

export default useProfileEditModal;
