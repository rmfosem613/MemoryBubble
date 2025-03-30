import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { LetterData } from '@/types/Letter';
import { getLetterImage } from '@/utils/letterUtils';

interface DraggableLetterProps {
  letter: LetterData;
  id: string;
  position: { x: number; y: number };
  isActive: boolean;
  containerSize: { width: number; height: number };
  zIndex: number;
  isAnimating: boolean;
  rotation: number;
}

export const DraggableLetter: React.FC<DraggableLetterProps> = ({
  letter,
  id,
  position,
  isActive,
  zIndex,
  isAnimating,
  rotation,
}) => {
  // useDraggable 훅 사용
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const imageSize = letter.type === 'letter' ? 100 : 120;

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `200px`,
    height: `${imageSize}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${rotation}deg)`
      : `rotate(${rotation}deg)`,
    zIndex: isActive ? 1000 : zIndex,
    cursor: 'grab',
    touchAction: 'none',
    transition: isAnimating
      ? 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'none',
    transformOrigin: 'center center',
  };

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      {...listeners}
      {...attributes}
      className="absolute select-none">
      <img
        src={getLetterImage(letter)}
        alt={`${letter.name}의 ${letter.type}`}
        className={`w-full h-fit object-contain drop-shadow-md ${isAnimating ? 'animate-fade-in' : ''} hover:scale-110 transition-transform duration-300`}
        draggable={false}
      />
    </div>
  );
};
