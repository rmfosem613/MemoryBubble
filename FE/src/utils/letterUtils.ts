import { ColorOption, LetterData, LetterMember } from '@/types/Letter';

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

// 보관함 관련

// 계절별 카세트 이미지
import cassetteSpring from '@/assets/letter/cassetteSpring.svg';
import cassetteSummer from '@/assets/letter/cassetteSummer.svg';
import cassetteAutumn from '@/assets/letter/cassetteAutumn.svg';
import cassetteWinter from '@/assets/letter/cassetteWinter.svg';

// 읽은 편지 이미지
import letterSpring from '@/assets/letter/LetterSpring.svg';
import letterSummer from '@/assets/letter/LetterSummer.svg';
import letterAutumn from '@/assets/letter/LetterAutumn.svg';
import letterWinter from '@/assets/letter/LetterWinter.svg';

// 안 읽은 편지 이미지
import unLetterSpring from '@/assets/letter/unLetterSpring.svg';
import unLetterSummer from '@/assets/letter/unLetterSummer.svg';
import unLetterAutumn from '@/assets/letter/unLetterAutumn.svg';
import unLetterWinter from '@/assets/letter/unLetterWinter.svg';

/**
 * 편지 타입과 상태에 따른 이미지를 반환하는 함수
 * @param letter 편지 데이터
 * @returns 해당 편지에 맞는 이미지 URL
 */
export const getLetterImage = (letter: LetterData): string => {
  const { type, backgroundColor, isRead } = letter;

  if (type === 'AUDIO') {
    switch (backgroundColor) {
      case 'spring':
        return cassetteSpring;
      case 'summer':
        return cassetteSummer;
      case 'autumn':
        return cassetteAutumn;
      case 'winter':
        return cassetteWinter;
      default:
        return cassetteWinter;
    }
  } else {
    // letter 타입인 경우
    if (isRead === false) {
      switch (backgroundColor) {
        case 'spring':
          return unLetterSpring;
        case 'summer':
          return unLetterSummer;
        case 'autumn':
          return unLetterAutumn;
        case 'winter':
          return unLetterWinter;
        default:
          return unLetterWinter;
      }
    } else {
      switch (backgroundColor) {
        case 'spring':
          return letterSpring;
        case 'summer':
          return letterSummer;
        case 'autumn':
          return letterAutumn;
        case 'winter':
          return letterWinter;
        default:
          return letterWinter;
      }
    }
  }
};
