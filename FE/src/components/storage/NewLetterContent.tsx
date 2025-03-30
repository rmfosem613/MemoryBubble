import React, { useRef } from 'react';
import { LetterData } from '@/types/Letter';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from '@dnd-kit/core';
import { useContainerSize } from '../../hooks/useContainerSize';
import { useLetterPositions } from '../../hooks/useLetterPositions';
import { useDragHandlers } from '../../hooks/useDragHandlers';
import { DraggableLetter } from './DraggableLetter';

interface NewLetterContentProps {
  letters?: LetterData[];
}

const NewLetterContent: React.FC<NewLetterContentProps> = ({
  letters = [
    {
      type: 'letter',
      color: 'autumn',
      name: '아빠',
      state: '안읽음',
      date: '2025.01.17',
    },
    {
      type: 'cassette',
      color: 'spring',
      name: '엄마',
      state: '안읽음',
      date: '2025.01.15',
    },
    {
      type: 'letter',
      color: 'summer',
      name: '엄마',
      state: '안읽음',
      date: '2025.01.15',
    },
    {
      type: 'letter',
      color: 'winter',
      name: '엄마',
      state: '안읽음',
      date: '2025.01.15',
    },
    {
      type: 'letter',
      color: 'spring',
      name: '딸',
      state: '안읽음',
      date: '2025.01.18',
    },
    {
      type: 'cassette',
      color: 'autumn',
      name: '아들',
      state: '안읽음',
      date: '2025.01.20',
    },
    {
      type: 'cassette',
      color: 'summer',
      name: '아들',
      state: '안읽음',
      date: '2025.01.20',
    },
    {
      type: 'cassette',
      color: 'winter',
      name: '아들',
      state: '안읽음',
      date: '2025.01.20',
    },
  ],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 커스텀 hooks 사용
  const containerSize = useContainerSize(containerRef);
  const { letterPositions, isAnimating, updateLetterPosition } =
    useLetterPositions(letters, containerSize);
  const { activeId, handleDragStart, handleDragEnd } = useDragHandlers(
    letters,
    letterPositions,
    containerSize,
    updateLetterPosition,
  );

  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        delay: 100,
      },
    }),
  );

  // Dropable 컴포넌트
  const { setNodeRef } = useDroppable({
    id: 'letters-container',
  });

  return (
    <div className="flex flex-col items-center h-full p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">새 편지함</h2>

      <div
        ref={containerRef}
        className="w-full h-[calc(100%-3rem)] relative bg-white/50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
        {containerSize.width > 0 && (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <div ref={setNodeRef} className="w-full h-full relative">
              {letters.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">아직 새로운 편지가 없습니다.</p>
                </div>
              ) : (
                letters.map((letter, index) => {
                  const id = `${letter.type}-${letter.color}-${index}`;
                  return letterPositions[id] ? (
                    <DraggableLetter
                      key={id}
                      id={id}
                      letter={letter}
                      position={{
                        x: letterPositions[id].x,
                        y: letterPositions[id].y,
                      }}
                      isActive={activeId === id}
                      containerSize={containerSize}
                      zIndex={letterPositions[id].zIndex}
                      isAnimating={isAnimating}
                      rotation={letterPositions[id].rotation}
                    />
                  ) : null;
                })
              )}
            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default NewLetterContent;
