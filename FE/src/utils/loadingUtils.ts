import { Bubble, Line } from '@/types/Loading';

export const createLineConstructor = (ctx: CanvasRenderingContext2D | null) => {
  return function createLine(this: Line) {
    // 라인 속성 초기화
    this.lineLength = 0;         // 라인의 길이
    this.popDistance = 0;        // 버블이 터질 때 라인이 이동하는 거리
    this.popDistanceReturn = 0;  // 라인이 원래 위치로 돌아올 때 사용하는 거리
    this.inversePop = false;     // 터짐 역방향 여부
    this.popping = false;        // 터지는 중인지 여부
    this.bubble = {} as Bubble;  // 이 라인이 속한 버블 객체
    this.index = 0;              // 라인의 인덱스

    // 라인 값을 초기화하는 함수
    this.resetValues = function () {
      this.lineLength = 0;
      this.popDistance = 0;
      this.popDistanceReturn = 0;
      this.inversePop = false;
      this.popping = false;
      this.updateValues();
    };

    // 라인의 위치 및 길이 값을 업데이트하는 함수
    this.updateValues = function () {
      if (!this.bubble || !this.bubble.position) return;

      // 버블 중심으로부터의 각도에 따라 라인 시작점 위치 계산
      this.x = this.bubble.position.x + (this.bubble.radius + this.popDistanceReturn) *
        Math.cos(2 * Math.PI * this.index / this.bubble.lines.length);
      this.y = this.bubble.position.y + (this.bubble.radius + this.popDistanceReturn) *
        Math.sin(2 * Math.PI * this.index / this.bubble.lines.length);

      // 라인 길이 계산
      this.lineLength = this.bubble.radius * this.popDistance;
      this.endX = this.lineLength;
      this.endY = this.lineLength;
    };

    // 라인을 캔버스에 렌더링하는 함수
    this.render = function () {
      if (!ctx) return;
      this.updateValues();

      // 라인 스타일 설정
      ctx.beginPath();
      ctx.strokeStyle = '#8bc9ee';  // 라인 색상
      ctx.lineWidth = 2;            // 라인 두께

      if (this.x === undefined || this.y === undefined) return;
      ctx.moveTo(this.x, this.y);  // 라인 시작점 설정

      // 버블 중심 기준으로 라인 방향 설정
      if (this.bubble && this.bubble.position) {
        // X축 방향 결정 (왼쪽/오른쪽)
        if (this.x < this.bubble.position.x) {
          this.endX = this.lineLength * -1;
        }
        // Y축 방향 결정 (위/아래)
        if (this.y < this.bubble.position.y) {
          this.endY = this.lineLength * -1;
        }
        // 정확히 같은 Y축에 있을 경우
        if (this.y === this.bubble.position.y) {
          this.endY = 0;
        }
        // 정확히 같은 X축에 있을 경우
        if (this.x === this.bubble.position.x) {
          this.endX = 0;
        }
      }

      if (this.endX === undefined || this.endY === undefined) return;
      // 라인 끝점 그리기
      ctx.lineTo(this.x + this.endX, this.y + this.endY);
      ctx.stroke();
    };
  };
};

export const createBubbleConstructor = (
  ctx: CanvasRenderingContext2D | null,
  canvasWidth: number,
  canvasHeight: number,
  popLines: number,
  createLine: ReturnType<typeof createLineConstructor>
) => {
  return function createBubble(this: Bubble) {
    // 버블 속성 초기화
    this.position = { x: 0, y: 0 };   // 버블 위치

    // 방울 크기 및 위치 설정
    this.radius = 8 + Math.random() * 16;                  // 버블 반지름 (8~24 범위 내 랜덤)
    this.xOff = Math.random() * canvasWidth - this.radius; // X축 오프셋
    this.yOff = Math.random() * canvasHeight;              // Y축 오프셋
    this.distanceBetweenWaves = 50 + Math.random() * 40;   // 파도 간격 (사인파 주기)
    this.count = canvasHeight + this.yOff;                 // 카운터 (위치 계산에 사용)
    this.color = '#3D4EAC';                                // 버블 색상
    this.lines = [];                                       // 터질 때 생성되는 라인 배열
    this.popping = false;                                  // 터지는 중인지 여부

    // 버블 회전 관련 속성
    this.maxRotation = 85;                                                            // 최대 회전 각도
    this.rotation = Math.floor(Math.random() * (this.maxRotation - (this.maxRotation * -1))) + (this.maxRotation * -1); // 회전 초기값
    this.rotationDirection = 'forward';                                               // 회전 방향

    // 방울을 터뜨렸을 때 터지는 action의 선 생성
    for (let i = 0; i < popLines; i++) {
      const tempLine = new (createLine as any)() as Line;
      tempLine.bubble = this;         // 라인에 버블 참조 설정
      tempLine.index = i;             // 라인 인덱스 설정
      this.lines.push(tempLine);      // 라인 배열에 추가
    }

    // 버블 위치 초기화 및 재설정 함수
    this.resetPosition = function () {
      this.position = { x: 0, y: 0 };
      this.radius = 8 + Math.random() * 6;               // 버블 크기 재설정 (8~14 범위 내 랜덤)
      this.xOff = Math.random() * canvasWidth - this.radius;
      this.yOff = Math.random() * canvasHeight;
      this.distanceBetweenWaves = 50 + Math.random() * 40;
      this.count = canvasHeight + this.yOff;
      this.popping = false;                              // 터짐 상태 초기화
    };

    // 버블을 캔버스에 렌더링하는 함수
    this.render = function () {
      if (!ctx) return;

      // 버블 회전 방향과 각도 업데이트
      if (this.rotationDirection === 'forward') {
        if (this.rotation < this.maxRotation) {
          this.rotation++;            // 순방향 회전
        } else {
          this.rotationDirection = 'backward';  // 최대 각도 도달 시 역방향으로 전환
        }
      } else {
        if (this.rotation > this.maxRotation * -1) {
          this.rotation--;            // 역방향 회전
        } else {
          this.rotationDirection = 'forward';   // 최소 각도 도달 시 순방향으로 전환
        }
      }

      // 캔버스 상태 저장 후 버블 위치로 이동하고 회전
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation * Math.PI / 180);

      // 터지는 중이 아닐 때만 버블 그리기
      if (!this.popping) {
        // 안쪽 반원 그리기
        ctx.beginPath();
        ctx.strokeStyle = '#7DABF8';   // 안쪽 선 색상
        ctx.lineWidth = 1;             // 선 두께
        ctx.arc(0, 0, this.radius - 3, 0, Math.PI * 1.5, true);  // 반원 형태로 그림
        ctx.stroke();

        // 바깥쪽 원 그리기
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);  // 완전한 원
        ctx.stroke();
      }

      // 캔버스 상태 복원
      ctx.restore();

      // 라인 그리기 (버블이 터질 때)
      for (let a = 0; a < this.lines.length; a++) {
        if (this.lines[a].popping) {
          // 라인이 최대 길이에 도달하지 않았고 역방향이 아닌 경우
          if (this.lines[a].lineLength < this.radius * 0.5 && !this.lines[a].inversePop) {
            this.lines[a].popDistance += 0.06;  // 라인 길이 증가
          } else {
            // 역방향으로 전환하여 라인 길이 감소
            if (this.lines[a].popDistance >= 0) {
              this.lines[a].inversePop = true;
              this.lines[a].popDistanceReturn += 1;
              this.lines[a].popDistance -= 0.03;
            } else {
              // 라인 길이가 0보다 작아지면 초기화
              this.lines[a].resetValues();
              this.resetPosition();
            }
          }

          // 라인 값 업데이트 및 렌더링
          this.lines[a].updateValues();
          this.lines[a].render();
        }
      }
    };
  };
};