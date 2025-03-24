import { useState, useEffect } from 'react';
import { LetterData } from '@/types/Letter';

type LetterPosition = {
  x: number;
  y: number;
  zIndex: number;
  rotation: number;
};

export const useLetterPositions = (
  letters: LetterData[],
  containerSize: { width: number; height: number },
) => {
  const [letterPositions, setLetterPositions] = useState<
    Record<string, LetterPosition>
  >({});
  const [nextZIndex, setNextZIndex] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState(false);

  // 컨테이너 크기가 변경되거나 letters가 변경될 때 편지 위치 초기화
  useEffect(() => {
    if (
      containerSize.width === 0 ||
      containerSize.height === 0 ||
      letters.length === 0
    )
      return;

    const shouldInitializePositions =
      Object.keys(letterPositions).length === 0 ||
      Object.keys(letterPositions).length !== letters.length;

    if (shouldInitializePositions) {
      // 처음에는 모든 편지를 중앙에 배치
      initializeCenteredPositions();

      // 잠시 후 무작위 위치로 퍼지도록 설정
      setTimeout(() => {
        setIsAnimating(true); // 애니메이션 활성화
        initializeRandomPositions();

        // 애니메이션 완료 후 상태 초기화
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }, 300);
    }
  }, [containerSize, letters]);

  // 편지 위치 초기화 함수 - 중앙 배치 버전
  const initializeCenteredPositions = () => {
    const newPositions: Record<string, LetterPosition> = {};

    // 중앙 좌표 계산
    const centerX = containerSize.width / 2 - 100; // 폭의 절반
    const centerY = containerSize.height / 2 - 60; // 높이의 절반

    // 모든 편지를 중앙에 배치 (살짝 겹쳐서 쌓여있는 효과)
    letters.forEach((letter, index) => {
      const id = `${letter.type}-${letter.color}-${index}`;

      // 약간의 오프셋 추가 (중앙에서 살짝 겹쳐져 보이도록)
      const offsetX = Math.random() * 10 - 5; // -5부터 5까지의 랜덤값
      const offsetY = Math.random() * 10 - 5; // -5부터 5까지의 랜덤값

      // z-index 설정 (인덱스 기반)
      const zIndex = 10 + index;

      // 초기 회전 값은 0
      const rotation = 0;

      newPositions[id] = {
        x: centerX + offsetX,
        y: centerY + offsetY,
        zIndex,
        rotation,
      };
    });

    setLetterPositions(newPositions);
    setNextZIndex(10 + letters.length);
  };

  // 편지 위치 초기화 함수 - 무작위 배치 버전
  const initializeRandomPositions = () => {
    const newPositions: Record<string, LetterPosition> = {};

    // 안전 마진
    const safeMargin = 20;

    // 기존 z-index 유지하고 회전 추가
    letters.forEach((letter, index) => {
      const id = `${letter.type}-${letter.color}-${index}`;

      // 이미지 크기
      const imageWidth = 200;
      const imageHeight = letter.type === 'letter' ? 100 : 120;

      // 완전 무작위 위치 생성
      const randomX =
        safeMargin +
        Math.random() * (containerSize.width - imageWidth - safeMargin * 2);
      const randomY =
        safeMargin +
        Math.random() * (containerSize.height - imageHeight - safeMargin * 2);

      // 최종 위치
      const x = Math.max(
        safeMargin,
        Math.min(containerSize.width - imageWidth - safeMargin, randomX),
      );
      const y = Math.max(
        safeMargin,
        Math.min(containerSize.height - imageHeight - safeMargin, randomY),
      );

      // 기존 z-index 유지 또는 새로 설정
      const zIndex = letterPositions[id]?.zIndex || 10 + index;

      // 랜덤 회전 각도 설정 (-15도에서 15도 사이)
      const rotation = Math.random() * 30 - 15;

      newPositions[id] = { x, y, zIndex, rotation };
    });

    setLetterPositions(newPositions);
  };

  // 드래그 완료 후 위치 업데이트
  const updateLetterPosition = (
    id: string,
    newX: number,
    newY: number,
    letters: LetterData[],
  ) => {
    if (!letterPositions[id]) return;

    const newZIndex = nextZIndex;
    setNextZIndex((prev) => prev + 1);

    setLetterPositions((prev) => ({
      ...prev,
      [id]: {
        x: newX,
        y: newY,
        zIndex: newZIndex,
        rotation: prev[id].rotation,
      },
    }));
  };

  return {
    letterPositions,
    isAnimating,
    nextZIndex,
    updateLetterPosition,
  };
};
