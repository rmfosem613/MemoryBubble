export interface Bubble {
  position: { x: number; y: number };
  radius: number;
  xOff: number;
  yOff: number;
  distanceBetweenWaves: number;
  count: number;
  color: string;
  lines: Line[];
  popping: boolean;
  maxRotation: number;
  rotation: number;
  rotationDirection: 'forward' | 'backward';
  resetPosition: () => void;
  render: () => void;
}

export interface Line {
  lineLength: number;
  popDistance: number;
  popDistanceReturn: number;
  inversePop: boolean;
  popping: boolean;
  bubble: Bubble;
  index: number;
  x?: number;
  y?: number;
  endX?: number;
  endY?: number;
  resetValues: () => void;
  updateValues: () => void;
  render: () => void;
}

export interface LoadingPageProps {
  message?: string;
}