import { useLetterStore } from '@/stores/useLetterStore';
import LetterContainer from '@/components/letter/common/LetterContainer';
import SeasonalDecorations from '@/components/letter/common/SeasonTemplate';

function TextLetterContent() {
  const { selectedColor, selectedMember } = useLetterStore();

  return (
    <LetterContainer>
      {/* 편지지 데코레이션: z-0 */}
      <SeasonalDecorations selectedColor={selectedColor} />

      <div className="relative z-10 h-full flex flex-col">
        <div>
          <div className="flex space-x-3 relative z-20 items-end mb-[9px]">
            <p className="text-h3-lg font-p-700">TO.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">
              {selectedMember ? selectedMember.label : '사랑스런 큰딸'}
            </p>
          </div>
        </div>

        {/* 편지지 줄 7개 추가 */}
        {[...Array(7)].map((_, index) => (
          <div key={index}>
            <hr className="border-t border-gray-400 my-[26.7px]" />
          </div>
        ))}

        <div>
          <div className="flex space-x-3 relative z-20 items-end mt-[-31px] justify-end">
            <p className="text-h3-lg font-p-700">From.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">엄마가</p>
          </div>
        </div>
      </div>

      {/* 편지지 내용 입력: z-30 */}
      <div className="absolute top-[-10px] mt-[60px] z-30 flex flex-col w-full pr-[40px]">
        <textarea
          className='resize-none h-[370px]'
          style={{ backgroundColor: 'transparent', lineHeight: '340%', outline: 'none' }}
          rows={9}
        />
      </div>
    </LetterContainer>
  );
};

export default TextLetterContent;