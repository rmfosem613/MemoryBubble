import React, { useState } from 'react';
import { useUserStore } from '@/stores/useUserStroe';

const GroupNameModal = () => {
  const { familyInfo, setFamilyInfo } = useUserStore();
  const [newGroupName, setNewGroupName] = useState(familyInfo.familyName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(e.target.value);
  };

  const handleConfirmClick = () => {
    setFamilyInfo({
      ...familyInfo,
      familyName: newGroupName,
    });
  };

  return (
    <div className="mb-3">
      <p className="pb-2">수정할 그룹명을 입력해주세요.</p>
      <input
        type="text"
        value={newGroupName}
        onChange={handleChange}
        className="w-full py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="그룹명을 입력하세요"
      />
    </div>
  );
};

export default GroupNameModal;
