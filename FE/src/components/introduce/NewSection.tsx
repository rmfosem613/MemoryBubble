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
        className="sticky top-0 min-h-[500px] -mt-[40px] w-full bg-autumn-000 transition-all duration-500 ease-in-out"
        style={{
          transform: `translateY(${newSectionPosition})`
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