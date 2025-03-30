import { useMemo } from 'react';
import { useCalendarStore } from '@/stores/useCalendarStore';

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

export function useCalendar(): CalendarHookReturn {
  const { currentDate, selectDate } = useCalendarStore();

  // 요일 이름 배열
  const dayNames: DayName[] = ['일', '월', '화', '수', '목', '금', '토'];

  // 현재 달의 날짜 생성
  const days: DayInfo[] = useMemo(() => {
    const dateInfo = getCalendarDateInfo(currentDate);

    // 빈 칸 배열 만들기 (첫 주 시작 전)
    const emptyDays: DayInfo[] = Array.from(
      { length: dateInfo.firstDayOfWeek },
      () => ({
        date: null,
      }),
    );

    // 현재 달의 날짜 배열 만들기
    const monthDays: DayInfo[] = Array.from(
      { length: dateInfo.daysInMonth },
      (_, i) => {
        const dayNumber: number = i + 1;

        return {
          date: dayNumber,
          isToday: isToday(dayNumber, dateInfo),
          isSelect: isSelect(dayNumber, dateInfo, selectDate),
        };
      },
    );

    // 두 배열 합치기
    return [...emptyDays, ...monthDays];
  }, [currentDate, selectDate]);

  return {
    dayNames,
    days,
  };
}

// ------------------------------------------------------------------------------
function getCalendarDateInfo(date: Date): CalendarDateInfo {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    year: date.getFullYear(), // 현재 연도
    month: date.getMonth(), // 현재 월 (0-11)
    today: new Date(), // 오늘 날짜
    firstDay, // 현재 월의 첫 날
    lastDay, // 현재 월의 마지막 날
    firstDayOfWeek: firstDay.getDay(), // 현재 월의 첫 날 요일 (0: 일요일, 6: 토요일)
    daysInMonth: lastDay.getDate(), // 현재 월의 총 일수
  };
}

function isToday(day: number, dateInfo: CalendarDateInfo): boolean {
  return (
    dateInfo.today.getDate() === day &&
    dateInfo.today.getMonth() === dateInfo.month &&
    dateInfo.today.getFullYear() === dateInfo.year
  );
}

function isSelect(
  day: number,
  dateInfo: CalendarDateInfo,
  selectDate: Date,
): boolean {
  return (
    selectDate.getDate() === day &&
    selectDate.getMonth() === dateInfo.month &&
    selectDate.getFullYear() === dateInfo.year
  );
}
