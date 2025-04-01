import { useEffect, useState } from 'react';
import DatePicker from '@/components/common/DatePicker';
import LetterDropdown from '@/components/letter/common/LetterDropDown';
import ColorSelector from '@/components/letter/common/ColorSelector';
import { useLetterStore } from '@/stores/useLetterStore';
import { COLOR_OPTIONS } from '@/utils/letterUtils';
import { useUserApi } from '@/apis/useUserApi';
import { LetterMember } from '@/types/Letter';

interface LetterControlsProps {
  onDateChange: (date: Date | null) => void;
}

function LetterControls({ onDateChange }: LetterControlsProps) {
  const { selectedColor, setSelectedColor, selectedMember, setSelectedMember } = useLetterStore();
  const [familyMembers, setFamilyMembers] = useState<LetterMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCurrentUser, fetchFamilyInfo } = useUserApi();

  // 가족 구성원 정보 조회
  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        setIsLoading(true);
        
        // 현재 로그인한 사용자 정보 조회
        const userResponse = await fetchCurrentUser();
        const currentUser = userResponse.data;
        
        // 가족 ID가 있는 경우에만 가족 정보 조회
        if (currentUser.familyId) {
          const familyResponse = await fetchFamilyInfo(currentUser.familyId);
          const family = familyResponse.data;
          
          // 가족 구성원 데이터를 LetterMember 형식으로 변환
          const members: LetterMember[] = family.familyMembers.map(member => ({
            id: member.userId.toString(),
            label: member.name
          }));
          
          setFamilyMembers(members);
        }
      } catch (error) {
        console.error('가족 구성원 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFamilyMembers();
  }, [fetchCurrentUser, fetchFamilyInfo]);

  const handleMemberSelect = (option: { id: string; label: string }) => {
    setSelectedMember(option);
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId as any);
  };

  const handleDateChange = (date: Date) => {
    onDateChange(date);
  };

  return (
    <div className="border-2 border-gray-300 rounded-[8px] h-full w-full mb-1">
      <div className="bg-gray-200 p-[10px] mb-[10px]">
        <p className="text-h5-lg font-p-500">편지 상세 설정</p>
      </div>

      <div className="ml-[12px]">
        {/* 받는 사람 */}
        <p className="text-subtitle-1-lg font-p-500 mb-[3px]">받는 사람</p>
        <LetterDropdown 
          options={familyMembers}
          placeholder={isLoading ? "로딩 중..." : "멤버"}
          onSelect={handleMemberSelect}
          selectedOption={selectedMember}
        />

        {/* 느린 편지 보내기 */}
        <p className="text-subtitle-1-lg font-p-500">느린 편지 보내기</p>
        <p className="text-sm-lg mb-[3px]">설정 시, 해당 날짜에 열람 가능합니다.</p>

        {/* DatePicker */}
        <div className="mr-[12px] mb-[30px]">
          <DatePicker onChange={handleDateChange} />
        </div>

        {/* 색상 */}
        <p className="text-subtitle-1-lg font-p-500">색상</p>
        <ColorSelector 
          colors={COLOR_OPTIONS} 
          selectedColor={selectedColor} 
          onSelectColor={handleColorSelect} 
        />
      </div>
    </div>
  );
}

export default LetterControls;