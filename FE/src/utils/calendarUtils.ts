// 월별 영문 표기
export const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

// 계절별 색상
export const SEASON_COLORS = {
  // 겨울 (12월, 1월, 2월)
  winter: {
    border: ['border-winter-100', 'border-winter-200', 'border-winter-300'],
    bg: ['bg-winter-100', 'bg-winter-200', 'bg-winter-300'],
    text: ['text-winter-100', 'text-winter-200', 'text-winter-300'],
  },
  // 봄 (3월, 4월, 5월)
  spring: {
    border: ['border-spring-100', 'border-spring-200', 'border-spring-300'],
    bg: ['bg-spring-100', 'bg-spring-200', 'bg-spring-300'],
    text: ['text-spring-100', 'text-spring-200', 'text-spring-300'],
  },
  // 여름 (6월, 7월, 8월)
  summer: {
    border: ['border-summer-100', 'border-summer-200', 'border-summer-300'],
    bg: ['bg-summer-100', 'bg-summer-200', 'bg-summer-300'],
    text: ['text-summer-100', 'text-summer-200', 'text-summer-300'],
  },
  // 가을 (9월, 10월, 11월)
  autumn: {
    border: ['border-autumn-100', 'border-autumn-200', 'border-autumn-300'],
    bg: ['bg-autumn-100', 'bg-autumn-200', 'bg-autumn-300'],
    text: ['text-autumn-100', 'text-autumn-200', 'text-autumn-300'],
  },
};

// 계절별 SVG 파일 경로
export const SEASON_SVG = {
  winter: '/calendar-winter.svg',
  spring: '/calendar-spring.svg',
  summer: '/calendar-summer.svg',
  autumn: '/calendar-autumn.svg',
};

// 월별 계절 정보 얻기
export const getSeasonByMonth = (
  month: number,
): 'winter' | 'spring' | 'summer' | 'autumn' => {
  // 자바스크립트는 월을 0부터 시작 (0: 1월, 11: 12월)
  switch (month) {
    case 11: // 12월
    case 0: // 1월
    case 1: // 2월
      return 'winter';
    case 2: // 3월
    case 3: // 4월
    case 4: // 5월
      return 'spring';
    case 5: // 6월
    case 6: // 7월
    case 7: // 8월
      return 'summer';
    case 8: // 9월
    case 9: // 10월
    case 10: // 11월
      return 'autumn';
    default:
      return 'spring'; // 기본값
  }
};

// 월별 색상 배열 가져오기
export const getMonthColors = (date: Date) => {
  const month = date.getMonth();
  const season = getSeasonByMonth(month);
  return SEASON_COLORS[season];
};
// 월 이름 가져오기
export const getMonthName = (date: Date): string => {
  const month = date.getMonth();
  return MONTHS[month];
};

// 계절 SVG 가져오기
export const getSeasonSvg = (date: Date): string => {
  const month = date.getMonth();
  const season = getSeasonByMonth(month);
  return SEASON_SVG[season];
};
