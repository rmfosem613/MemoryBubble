// ---------------- store -----------------
// 스토어 관련 타입
export interface CalendarStore {
  currentDate: Date;
  selectDate: Date;
  nextMonth: () => void;
  prevMonth: () => void;
  setSelectDate: (year: number, month: number, day: number) => void;
}

// ---------------- hook -----------------
// 요일명 리터럴 타입
export type DayName = '일' | '월' | '화' | '수' | '목' | '금' | '토';

// 날짜 계산 관련 타입
export interface CalendarDateInfo {
  year: number;
  month: number;
  today: Date;
  firstDay: Date;
  lastDay: Date;
  firstDayOfWeek: number;
  daysInMonth: number;
}

//  날짜 정보 타입 
export type DayInfo = {
  date: number | null;
  isToday?: boolean;
  isSelect?: boolean;
};

// 훅의 반환 타입
export interface CalendarHookReturn {
  dayNames: DayName[];
  days: DayInfo[];
}