import DatePicker from '@/components/common/DatePicker'
import LetterDropdown from '@/components/letter/common/LetterDropDown'
import ColorSelector from '@/components/letter/common/ColorSelector'
import { useLetterStore } from '@/stores/useLetterStore'
import { COLOR_OPTIONS, MEMBER_OPTIONS } from '@/utils/letterUtils';

function LetterControls() {
  const { selectedColor, setSelectedColor, selectedMember, setSelectedMember } = useLetterStore();

  const handleMemberSelect = (option: { id: string; label: string }) => {
    setSelectedMember(option);
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId as any);
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
          options={MEMBER_OPTIONS}
          placeholder="멤버"
          onSelect={handleMemberSelect}
          selectedOption={selectedMember}
        />

        {/* 느린 편지 보내기 */}
        <p className="text-subtitle-1-lg font-p-500">느린 편지 보내기</p>
        <p className="text-sm-lg mb-[3px]">설정 시, 해당 날짜에 열람 가능합니다.</p>

        {/* DatePicker */}
        <div className="mr-[12px] mb-[30px]">
          <DatePicker onChange={(date) => console.log('선택된 날짜:', date)} />
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