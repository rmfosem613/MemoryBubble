import React, { useEffect, useRef, useState } from 'react';
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
import LetterAnimation from '@/components/storage/animation/LetterAnimation';

import apiClient from '@/apis/apiClient';

interface NewLetterContentProps {
  initialLetters?: LetterData[];
}

const NewLetterContent: React.FC<NewLetterContentProps> = ({
  initialLetters = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [letters, setLetters] = useState<LetterData[]>(initialLetters);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 선택된 편지와 애니메이션 상태 추가
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [isAnimationOpen, setIsAnimationOpen] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchLetters = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/api/letters');
        console.log(response.data, '편지 목록');

        if (response.data && Array.isArray(response.data)) {
          const unreadLetters = response.data.filter(
            (letter) => letter.isRead === false,
          );
          setLetters(unreadLetters);
        }
        setError(null);
      } catch (error) {
        console.error('편지 목록 가져오기 실패:', error);
        setError('편지 목록을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetters();
  }, []);

  // 편지 클릭 핸들러 - 상세 정보 가져오기 및 애니메이션 표시
  const handleLetterClick = async (id: number) => {
    try {
      const response = await apiClient.get(`/api/letters/${id}`);
      console.log(response.data, '편지 상세 정보');

      // 상세 정보를 상태에 저장
      setSelectedLetter(response.data);
      // 애니메이션 열기
      setIsAnimationOpen(true);

      // 읽은 편지는 목록에서 제거
      setLetters((prev) => prev.filter((letter) => letter.letterId !== id));
    } catch (error) {
      console.error('편지 상세 정보 가져오기 실패:', error);
    }
  };

  // 애니메이션 닫기 핸들러
  const handleCloseAnimation = () => {
    setIsAnimationOpen(false);
    setTimeout(() => {
      setSelectedLetter(null);
    }, 800); // 애니메이션이 끝나는 시간과 맞춤
  };

  return (
    <div className="flex flex-col items-center h-full p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">새 편지함</h2>

      <div
        ref={containerRef}
        className="w-full h-[calc(100%-3rem)] relative bg-white/50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">편지를 불러오는 중입니다...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          containerSize.width > 0 && (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}>
              <div ref={setNodeRef} className="w-full h-full relative">
                {letters.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      새로운 편지가 없습니다.
                    </p>
                  </div>
                ) : (
                  letters.map((letter, index) => {
                    const id = `${letter.type}-${letter.backgroundColor}-${index}`;
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
                        onClick={() => handleLetterClick(letter.letterId)} // 클릭 이벤트 추가
                      />
                    ) : null;
                  })
                )}
              </div>
            </DndContext>
          )
        )}
      </div>

      {/* 편지 애니메이션 컴포넌트 */}
      <LetterAnimation
        letter={selectedLetter}
        isOpen={isAnimationOpen}
        onClose={handleCloseAnimation}
      />
    </div>
  );
};

export default NewLetterContent;
