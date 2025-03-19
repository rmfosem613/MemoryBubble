import { ColorOption, LetterMember } from '@/types/Letter';

// 색상 정보를 정의하는 상수 객체
export const COLORS: Record<string, ColorOption> = {
  spring: { id: 'spring', className: 'bg-spring-200', waveColor: '#FFBFCD' }, 
  summer: { id: 'summer', className: 'bg-summer-200', waveColor: '#76C1DE' },
  autumn: { id: 'autumn', className: 'bg-autumn-200', waveColor: '#F8C37F' },
  winter: { id: 'winter', className: 'bg-winter-200', waveColor: '#97A1D6' },
};

// 색상 배열
export const COLOR_OPTIONS = [
  COLORS.spring,
  COLORS.summer,
  COLORS.autumn,
  COLORS.winter,
];

// 멤버 옵션
export const MEMBER_OPTIONS: LetterMember[] = [
  { id: 'mom', label: '울엄마' },
  { id: 'dad', label: '울아빠' },
  { id: 'daughter', label: '사랑스런 큰딸' },
  { id: 'son', label: '막내아들' },
];

// 최대 녹음 시간 (초)
export const MAX_RECORDING_TIME = 300; // 5분