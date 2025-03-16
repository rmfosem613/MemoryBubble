import { useLetterStore } from '@/stores/useLetterStore';
import { useLetterInput } from '@/hooks/useLetterInput';

import turtle from '@/assets/letter/summer-turtle.svg';
import seashell from '@/assets/letter/summer-seashell.svg';

function LetterContent() {
  const { pages, currentPage } = useLetterStore();
  const { textareaRefs, handleLineChange, handleKeyDown } = useLetterInput();

  return (
    <div className="relative border-2 border-gray-300 rounded-[8px] p-5 overflow-hidden">
      {/* 편지지 데코레이션: z-0 */}
      <img src={seashell} className="absolute top-[10px] left-[10px] z-0" />
      <img src={turtle} className="absolute bottom-[10px] right-[10px] z-0 w-[160px] lg:w-[180px] md:w-[170px] " />

      <div className="relative z-10 h-full flex flex-col">
        <div>
          <div className="flex space-x-3 relative z-20 items-end mb-[9px]">
            <p className="text-h3-lg font-h3">TO.</p>
            <p className="pb-[2px] text-h4-lg font-h4">사랑스런 큰딸</p>
          </div>
        </div>
        
        {/* 편지지 줄 9개 추가 */}
        {[...Array(9)].map((_, index) => (
          <div key={index}>
            {/* border-t : 굵기 0.5px */}
            <hr className="border-t border-gray-400 my-[19.7px]" />
          </div>
        ))}

        <div>
          <div className="flex space-x-3 relative z-20 items-end mt-[-15px] justify-end">
            <p className="text-h3-lg font-h3">From.</p>
            <p className="pb-[2px] text-h4-lg font-h4">엄마가</p>
          </div>
        </div>
      </div>

      {/* 편지지 내용 입력: z-30 */}
      <div className="absolute top-0 mt-[60px] z-30 flex flex-col w-full pr-[40px]">
        {pages[currentPage].lines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex items-center">
            <div className="relative w-full mb-[12px]">
              <textarea
                ref={(el) => {
                  if (el) textareaRefs.current[lineIndex] = el;
                }}
                value={line}
                onChange={e => handleLineChange(lineIndex, e.target.value)}
                onKeyDown={e => handleKeyDown(e, lineIndex)}
                className="w-full resize-none overflow-hidden text-p-lg font-paragraph-lg focus:outline-none focus:ring-0"
                style={{ backgroundColor: 'transparent' }}
                rows={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LetterContent;