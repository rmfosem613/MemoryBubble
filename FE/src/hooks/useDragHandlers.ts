import { useState } from 'react';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { LetterData } from '@/types/Letter';

type LetterPosition = {
  x: number;
  y: number;
  zIndex: number;
  rotation: number;
};

export const useDragHandlers = (
  letters: LetterData[],
  letterPositions: Record<string, LetterPosition>,
  containerSize: { width: number; height: number },
  updateLetterPosition: (
    id: string,
    newX: number,
    newY: number,
    letters: LetterData[],
  ) => void,
) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    // letterPositions에 해당 ID가 있는지 확인
    if (letterPositions[id]) {
      setActiveId(id);
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id as string;

    // 안전 장치 추가
    if (
      !letterPositions[id] ||
      !delta ||
      delta.x === undefined ||
      delta.y === undefined
    ) {
      setActiveId(null);
      return;
    }

    // 현재 위치에서 델타만큼 이동한 새 위치 계산
    if (letterPositions[id]) {
      const currentPosition = letterPositions[id];

      // 드래그되는 편지의 정보 찾기
      const letterIndex = parseInt(id.split('-')[2]);
      const draggedLetter = letters[letterIndex];

      if (!draggedLetter) {
        setActiveId(null);
        return;
      }

      // 이미지 크기
      const imageSize = draggedLetter.type === 'TEXT' ? 100 : 120;

      // 새 위치 계산
      let newX = currentPosition.x + delta.x;
      let newY = currentPosition.y + delta.y;

      // 안전 마진
      const margin = 10;

      // 경계를 벗어나지 않도록 제한
      newX = Math.max(
        margin,
        Math.min(containerSize.width - imageSize - margin, newX),
      );
      newY = Math.max(
        margin,
        Math.min(containerSize.height - imageSize - margin, newY),
      );

      // 위치 업데이트
      updateLetterPosition(id, newX, newY, letters);
    }

    setActiveId(null);
  };

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  };
};
