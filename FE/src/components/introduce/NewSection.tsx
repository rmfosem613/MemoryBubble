import React from 'react';
import Introduce from './Section';

interface NewSectionProps {
  newSectionPosition: string;
  nextSectionRef: React.RefObject<HTMLDivElement>;
}

const NewSection: React.FC<NewSectionProps> = ({ newSectionPosition, nextSectionRef }) => {
  return (
    <>
      <div
        ref={nextSectionRef}
        className="sticky top-0 min-h-screen w-full bg-white transition-all duration-500 ease-in-out"
        style={{
          transform: `translateY(${newSectionPosition})`,
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
        }}>
        {/* 새 섹션 내용 */}
        <div className="mx-auto pt-[75px]">
          <Introduce />
        </div>
      </div>
    </>
  );
};

export default NewSection;