// summer
import turtle from '@/assets/letter/summer-turtle.svg';
import seashell from '@/assets/letter/summer-seashell.svg';



function LetterContent() {

  return (
    <div className="relative border-2 border-gray-300 rounded-[8px] p-5 overflow-hidden">
      {/* 편지지 데코레이션: z-0 */}
      <img src={seashell} className="absolute top-[10px] left-[10px] z-0" />
      <img src={turtle} className="absolute bottom-[10px] right-[10px] z-0 w-[160px] lg:w-[180px] md:w-[170px] " />

      <div className="relative z-10 h-full flex flex-col">
        <div>
          <div className="flex space-x-3 relative z-20 items-end mb-[9px]">
            <p className="text-h3-lg font-p-700">TO.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">사랑스런 큰딸</p>
          </div>
        </div>

        {/* 편지지 줄 9개 추가 */}
        {[...Array(7)].map((_, index) => (
          <div key={index}>
            {/* border-t : 굵기 0.5px */}
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
    </div>
  );
};

export default LetterContent;