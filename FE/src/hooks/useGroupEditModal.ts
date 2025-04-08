import { useState, useRef, useEffect, ChangeEvent } from 'react';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

export const useGroupEditModal = (isOpen: boolean) => {
  const { updateFamilyInfo, uploadImageWithPresignedUrl } = useUserApi();
  const { user, family, setFamily } = useUserStore();

  const [groupName, setGroupName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기화
  useEffect(() => {
    if (isOpen) {
      setGroupName(family.familyName);
      setThumbnailPreview(family.thumbnailUrl+"&w=250");
      setThumbnail(null);
      setErrorMessage('');
    }
  }, [isOpen, family.familyName, family.thumbnailUrl]);

  // 입력 변경 시 에러 메시지 초기화
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    setErrorMessage('');
  };

  // 그룹명 blur 처리
  const handleGroupNameBlur = () => {
    const trimmedName = groupName.trim();
    setGroupName(trimmedName); // trim된 값으로 상태 업데이트

    if (!trimmedName) {
      setErrorMessage('그룹명을 입력해주세요.');
    }
  };

  // 이미지 선택 버튼 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.match('image.*')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setThumbnail(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = async () => {
    if (errorMessage) {
      return false; // 모달 유지
    }

    // 기존 이름과 동일하고 새 이미지가 없으면 API 호출 없이 닫기
    if (groupName === family.familyName && !thumbnail) {
      return true; // 모달 닫기
    }

    // api 요청
    try {
      setIsLoading(true);

      const response = await updateFamilyInfo(user.familyId, {
        familyName: groupName,
        isThumbnailUpdate: thumbnail ? true : false
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
            // 이미지 업로드 성공 시 이미지 URL 상태 업데이트
            setFamily({
              thumbnailUrl: thumbnailPreview,
            });
          } catch (uploadError) {
            alert('그룹명은 수정되었으나, 이미지 수정에 실패했습니다.');
            return false;
          }
        }
        alert('그룹 정보가 수정되었습니다.');
        if (window.location.pathname === '/main' && thumbnail) {
          window.location.reload();
        }
        return true; // 성공 시 모달 닫기
      } else {
        alert('그룹 정보 수정 중 오류가 발생했습니다.');
        return false; // 모달 유지
      }
    } catch (error) {
      alert('그룹 정보 수정 중 오류가 발생했습니다.');
      return false; // 모달 유지
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    groupName,
    thumbnailPreview,
    errorMessage,
    isLoading,
    fileInputRef,

    // 액션
    handleInputChange,
    handleGroupNameBlur,
    handleImageClick,
    handleFileChange,
    onConfirm,
  };
};
