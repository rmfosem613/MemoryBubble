import { useEffect, useRef, useState } from 'react';
import { Bubble } from '@/types/Loading';
import { createBubbleConstructor, createLineConstructor } from '@/utils/loadingUtils';

// 버블 애니메이션 훅의 반환 타입 인터페이스
interface UseBubbleAnimationReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}


const useLoading = (): UseBubbleAnimationReturn => {
  // 캔버스 요소에 대한 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 버블 배열을 저장하는 참조
  const bubbles = useRef<Bubble[]>([]);
  // 마우스 위치 오프셋을 저장하는 참조
  const mouseOffset = useRef({ x: 0, y: 0 });
  // 애니메이션 프레임 ID를 저장하는 참조
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    // 캔버스 요소 가져오기
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 캔버스 컨텍스트 가져오기
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 초기 캔버스 크기 설정 및 리사이즈 이벤트 리스너 추가
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 방울 속도, 갯수, 터질 때 생기는 라인 조정
    const bubbleCount = 20;    // 생성할 버블의 개수
    const bubbleSpeed = 1;     // 버블 이동 속도
    const popLines = 6;        // 버블이 터질 때 생성되는 라인 수
    let popDistance = 40;      // 버블이 터질 때 라인이 이동하는 거리

    // 생성자 함수 생성
    const createLine = createLineConstructor(ctx);  // 라인 생성자
    const createBubble = createBubbleConstructor(   // 버블 생성자
      ctx, 
      canvas.width, 
      canvas.height, 
      popLines, 
      createLine
    );

    // 버블 생성 및 초기화
    bubbles.current = [];
    for (let i = 0; i < bubbleCount; i++) {
      const tempBubble = new (createBubble as any)() as Bubble;
      bubbles.current.push(tempBubble);
    }

    // 애니메이션 루프 함수
    const animate = () => {
      if (!ctx) return;
      
      // 캔버스 초기화 (이전 프레임 지우기)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 버블 그리기
      ctx.beginPath();
      for (let i = 0; i < bubbles.current.length; i++) {
        const bubble = bubbles.current[i];
        // 사인파를 이용한 버블 좌우 움직임 계산
        bubble.position.x = Math.sin(bubble.count / bubble.distanceBetweenWaves) * 50 + bubble.xOff;
        bubble.position.y = bubble.count;
        // 버블 렌더링
        bubble.render();

        // 버블이 화면 위로 벗어나면 아래에서 다시 시작
        if (bubble.count < 0 - bubble.radius) {
          bubble.count = canvas.height + bubble.yOff;
        } else {
          // 버블을 위로 이동 (y축 값 감소)
          bubble.count -= bubbleSpeed;
        }
      }

      // 마우스와 버블 충돌 감지 및 터지는 효과 처리
      for (let i = 0; i < bubbles.current.length; i++) {
        const bubble = bubbles.current[i];
        // x축 충돌 확인
        if (
          mouseOffset.current.x > bubble.position.x - bubble.radius && 
          mouseOffset.current.x < bubble.position.x + bubble.radius
        ) {
          // y축 충돌 확인
          if (
            mouseOffset.current.y > bubble.position.y - bubble.radius && 
            mouseOffset.current.y < bubble.position.y + bubble.radius
          ) {
            // 버블이 터지는 효과 활성화
            for (let a = 0; a < bubble.lines.length; a++) {
              popDistance = bubble.radius * 0.5;
              bubble.lines[a].popping = true;
              bubble.popping = true;
            }
          }
        }
      }

      // 다음 프레임 요청
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // 마우스 이동 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
      // 캔버스 내 상대적인 마우스 위치 계산
      const rect = canvas.getBoundingClientRect();
      mouseOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // 마우스 이벤트 리스너 등록 및 애니메이션 시작
    canvas.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(animate);

    // 클린업 함수 - 컴포넌트 언마운트 시 실행
    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      // 애니메이션 프레임 취소
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // 빈 배열로 의존성을 설정하여 마운트 시에만 실행

  // 캔버스 참조 반환
  return { canvasRef };
};

export default useLoading;