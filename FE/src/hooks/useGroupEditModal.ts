import { useState, useRef, useEffect, ChangeEvent } from 'react';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

export const useGroupEditModal = (isOpen: boolean) => {
  const { updateFamilyInfo, uploadImageWithPresignedUrl, fetchFamilyInfo } =
    useUserApi();
  const { user, family, setFamily } = useUserStore();

  const [groupName, setGroupName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Alert 관련 상태 추가
  const [customAlert, setCustomAlert] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({
    show: false,
    message: '',
    color: '',
  });

  // 알림 표시 함수
  const showAlert = (message: string, color: string) => {
    setCustomAlert({
      show: true,
      message,
      color,
    });
  };

  // 알림 표시 후 3초 후에 상태 리셋
  useEffect(() => {
    if (customAlert.show) {
      const timer = setTimeout(() => {
        setCustomAlert({
          show: false,
          message: '',
          color: '',
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [customAlert.show]);

  // 초기화
  useEffect(() => {
    if (isOpen) {
      setGroupName(family.familyName);
      setThumbnailPreview(family.thumbnailUrl + '&w=250');
      setThumbnail(null);
      setErrorMessage('');
    }
  }, [isOpen, family.familyName, family.thumbnailUrl]);

  // 입력 변경 시 에러 메시지 초기화 및 10자 제한
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 10자 이하일 때만 상태 업데이트
    if (newValue.length <= 10) {
      setGroupName(newValue);
      setErrorMessage('');
    }
  };

  // 그룹명 blur 처리
  const handleGroupNameBlur = () => {
    const trimmedName = groupName.trim();
    setGroupName(trimmedName); // trim된 값으로 상태 업데이트

    if (!trimmedName) {
      setErrorMessage('그룹명을 입력해주세요.');
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (file, previewUrl = null) => {
    if (file) {
      setThumbnail(file);

      // 미리보기 URL도 함께 저장 (전달 받았을 경우)
      if (previewUrl) {
        setThumbnailPreview(previewUrl);
      }
    }
  };

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = async () => {
    if (errorMessage) {
      return false; // 모달 유지
    }

    // 기존 이름과 동일하고 새 이미지가 없으면 API 호출 없이 닫기
    if (groupName === family.familyName && !thumbnail) {
      showAlert('수정된 내용이 없습니다.', 'green');
      return true; // 모달 닫기
    }

    // api 요청
    try {
      setIsLoading(true);

      const response = await updateFamilyInfo(user.familyId, {
        familyName: groupName,
        isThumbnailUpdate: thumbnail ? true : false,
      });

      if (response.status === 200) {
        // 이름 업데이트 성공 시 이름 상태 업데이트
        setFamily({
          familyName: groupName,
        });
        // 이미지 업로드 처리
        if (thumbnail && response.data.presignedUrl) {
          try {
            await uploadImageWithPresignedUrl(
              response.data.presignedUrl,
              thumbnail,
            );
            const familyResponse = await fetchFamilyInfo(user.familyId);
            if (familyResponse.status === 200) {
              setFamily(familyResponse.data);
            }
          } catch (uploadError) {
            showAlert(
              '그룹명은 수정되었으나, 이미지 수정 중 오류가 발생했습니다.',
              'red',
            );
            return false;
          }
        }
        showAlert('그룹 정보가 수정되었습니다.', 'green');
        return true; // 성공 시 모달 닫기
      } else {
        showAlert('그룹 정보 수정 중 오류가 발생했습니다.', 'red');
        return false; // 모달 유지
      }
    } catch (error) {
      showAlert('그룹 정보 수정 중 오류가 발생했습니다.', 'red');
      return false; // 모달 유지
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    groupName,
    thumbnail,
    thumbnailPreview,
    errorMessage,
    isLoading,
    customAlert,

    // 액션
    handleInputChange,
    handleGroupNameBlur,
    handleFileChange,
    onConfirm,
    showAlert,
  };
};
