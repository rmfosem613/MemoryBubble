// useCalendar.ts
import { useMemo } from 'react';
import {
  DayInfo,
  DayName,
  CalendarDateInfo,
  CalendarHookReturn,
} from '@/types/CalendarType';
import useCalendarStore from '@/stores/useCalendarStore';

const getCalendarDateInfo = (date: Date): CalendarDateInfo => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    today: new Date(),
    firstDay,
    lastDay,
    firstDayOfWeek: firstDay.getDay(),
    daysInMonth: lastDay.getDate(),
  };
};

export function useCalendar(): CalendarHookReturn {
  const { currentDate, nextMonth, prevMonth } = useCalendarStore();

  // 요일 이름 배열
  const dayNames: DayName[] = ['일', '월', '화', '수', '목', '금', '토'];

  // 현재 달의 날짜 생성
  const days: DayInfo[] = useMemo(() => {
      const dateInfo = getCalendarDateInfo(currentDate);
      
    // 오늘 날짜 체크를 위한 비교
    const isToday = (day: number): boolean => {
      return (
        dateInfo.today.getDate() === day &&
        dateInfo.today.getMonth() === dateInfo.month &&
        dateInfo.today.getFullYear() === dateInfo.year
      );
    };

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
          isToday: isToday(dayNumber),
        };
      },
    );

    // 두 배열 합치기
    return [...emptyDays, ...monthDays];
  }, [currentDate]);

  return {
    currentDate,
    dayNames,
    days,
    nextMonth,
    prevMonth,
  };
}
