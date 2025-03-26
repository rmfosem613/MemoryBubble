import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import useUserStore from '@/stores/useUserStore';

interface GroupNameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupNameEditModal = ({ isOpen, onClose }: GroupNameEditModalProps) => {
  const familyName = useUserStore((state) => state.family.familyName);
  const updateFamilyName = useUserStore((state) => state.updateFamilyName);

  const [groupName, setGroupName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 초기화
  useEffect(() => {
    if (isOpen) {
      setGroupName(familyName);
      setErrorMessage('');
    }
  }, [isOpen, familyName]);

  // 확인 버튼 클릭 시 실행할 함수
  const onConfirm = () => {
    // 유효성 검사
    if (!groupName.trim()) {
      return false;
    }

    // 유효성 검사 통과 시 에러 메시지 초기화
    setErrorMessage('');

    // axios 처리

    // 저장 처리
    updateFamilyName(groupName);
  };

  // 입력 변경 시 에러 메시지 초기화
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    setErrorMessage('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="그룹명 수정"
      confirmButtonText="저장하기"
      cancelButtonText="취소하기"
      onConfirm={onConfirm}>
      <>
        <div className="mb-3">
          <p className="mb-1 text-gray-500">수정할 그룹명을 입력해주세요.</p>
          <input
            type="text"
            value={groupName}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="그룹명을 입력해주세요."
          />
          {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}
        </div>
      </>
    </Modal>
  );
};

export default GroupNameEditModal;
