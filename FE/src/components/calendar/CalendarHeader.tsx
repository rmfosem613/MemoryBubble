import React from 'react';
import useCalendarEventStore from '@/stores/useCalendarEventStore';
import { getMonthName, getSeasonSvg } from '@/utils/calendarUtils';

function CalendarHeader() {
  const selectDate = useCalendarEventStore((state) => state.selectDate);
  const monthName = getMonthName(selectDate);
  const seasonSvg = getSeasonSvg(selectDate);

  return (
    <div className="relative h-full">
      <img
        src={seasonSvg}
        alt="캘린더 배경"
        className="h-full w-full object-cover"
      />
      <div className="absolute right-0 -bottom-8 transform -rotate-90  flex items-center justify-center">
        <p className="w-16 text-white text-[105px] font-extrabold whitespace-nowrap select-none">
          {monthName}
        </p>
      </div>
    </div>
  );
}

export default CalendarHeader;
