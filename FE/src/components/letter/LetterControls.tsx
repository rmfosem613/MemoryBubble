import { useState } from 'react'
import DatePicker from '@/components/common/DatePicker'
import LetterDropdown from './LetterDropDown'
import ColorSelector from './ColorSelector'
import { useLetterStore } from '@/stores/useLetterStore'

// 색상 정보를 정의하는 상수 객체
export const COLORS = {
  spring: { id: 'spring', className: 'bg-spring-200', waveColor: '#FFBFCD' }, 
  summer: { id: 'summer', className: 'bg-summer-200', waveColor: '#76C1DE' },
  autumn: { id: 'autumn', className: 'bg-autumn-200', waveColor: '#F8C37F' },
  winter: { id: 'winter', className: 'bg-winter-200', waveColor: '#97A1D6' },
};

function LetterControls() {
  const { selectedColor, setSelectedColor } = useLetterStore();
  const [selectedMember, setSelectedMember] = useState<{ id: string; label: string } | null>(null);

  const colors = [
    COLORS.spring,
    COLORS.summer,
    COLORS.autumn,
    COLORS.winter,
  ];

  const memberOptions = [
    { id: 'mom', label: '울엄마' },
    { id: 'dad', label: '울아빠' },
    { id: 'daughter', label: '사랑스런 큰딸' },
    { id: 'son', label: '막내아들' },
  ];

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
          options={memberOptions}
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
          colors={colors} 
          selectedColor={selectedColor} 
          onSelectColor={handleColorSelect} 
        />
      </div>
    </div>
  );
}

export default LetterControls;