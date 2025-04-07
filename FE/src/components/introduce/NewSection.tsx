import React from 'react';

interface NewSectionProps {
  newSectionPosition: string;
  nextSectionRef: React.RefObject<HTMLDivElement>;
}

const NewSection: React.FC<NewSectionProps> = ({ newSectionPosition, nextSectionRef }) => {
  return (
    <div
      ref={nextSectionRef}
      className='fixed bottom-0 h-screen left-0 w-full bg-white transition-all duration-500 ease-in-out'
      style={{
        transform: `translateY(${newSectionPosition})`,
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
      }}
    >
      {/* 새 섹션 내용 */}
      <div className='container mx-auto py-16 px-4 h-full'>
        <h2 className='text-4xl font-bold mb-8 text-center'>새로운 섹션</h2>
        <p className='text-lg text-gray-700 text-center mb-12'>
          스크롤을 내리면 아래에서 올라오는 새로운 섹션입니다.
        </p>
        <div className='flex flex-wrap justify-center gap-8'>
          {/* 여기에 새 섹션의 내용을 추가하세요 */}
          <div className='bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md'>
            <h3 className='text-2xl font-semibold mb-4'>소제목 1</h3>
            <p className='text-gray-600'>
              새로운 섹션의 내용이 들어갑니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSection;