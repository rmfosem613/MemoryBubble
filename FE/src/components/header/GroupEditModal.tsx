import React, { useEffect, useState, useRef } from 'react';
import Modal from '@/components/common/Modal/Modal';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';

interface GroupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupEditModal = ({ isOpen, onClose }: GroupEditModalProps) => {
  const { updateFamilyInfo, uploadImageWithPresignedUrl } = useUserApi();

  const familyId = useUserStore((state) => state.user.familyId);
  const familyName = useUserStore((state) => state.family.familyName);
  const thumbnailUrl = useUserStore((state) => state.family.thumbnailUrl);
  const setFamily = useUserStore((state) => state.setFamily);

  const [groupName, setGroupName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기화
  useEffect(() => {
    if (isOpen) {
      setGroupName(familyName);
      setThumbnailPreview(thumbnailUrl);
      setThumbnail(null);
      setErrorMessage('');
    }
  }, [isOpen, familyName, thumbnailUrl]);

  // 입력 변경 시 에러 메시지 초기화
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    setErrorMessage('');
  };

  // 이미지 선택 버튼 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.match('image.*')) {
        setErrorMessage('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setThumbnail(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage('');
    }
  };

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = async () => {
    // 유효성 검사
    const trimmedName = groupName.trim();
    if (!trimmedName) {
      setErrorMessage('그룹명을 입력해주세요.');
      return false; // 모달 유지
    }
    setErrorMessage(''); // 유효성 검사 통과 시 에러 메시지 초기화

    // 기존 이름과 동일하고 새 이미지가 없으면 API 호출 없이 닫기
    if (trimmedName === familyName && !thumbnail) {
      return true; // 모달 닫기
    }

    // api 요청
    try {
      setIsLoading(true);

      if (familyId) {
        const response = await updateFamilyInfo(familyId, {
          familyName: trimmedName,
        });

        if (response.status === 200) {
          // 이름 업데이트 성공 시 이름 상태 업데이트
          setFamily({
            familyName: trimmedName,
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
              console.error('이미지 업로드 실패:', uploadError);
              setErrorMessage('이미지 업로드 중 오류가 발생했습니다.');
              return false;
            }
          }
          return true; // 모달 닫기
        } else {
          setErrorMessage('그룹 정보 수정 중 오류가 발생했습니다.');
          return false; // 모달 유지
        }
      }
      return false; // familyId 없으면 모달 유지
    } catch (error) {
      setErrorMessage('그룹 정보 수정 중 오류가 발생했습니다.');
      return false; // 모달 유지
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="mb-5">
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
        </div>

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
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="그룹명을 입력해주세요."
            maxLength={10}
            disabled={isLoading}
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 mt-1 text-sm">{errorMessage}</p>
        )}
      </>
    </Modal>
  );
};

export default GroupEditModal;
