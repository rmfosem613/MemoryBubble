import React from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import Calendar from '@/components/calendar/Calendar';
import CalendarEvent from '@/components/calendar/CalendarEvent';

function CalendarPage() {
  return (
    <div className="w-full h-screen pt-[65px] grid grid-cols-[1fr_660px_366px_1fr]">
      {/* 영역 1 */}
      <div className="border flex items-center justify-center">
        <CalendarHeader />
      </div>

      {/* 영역 2 */}
      <div className="border flex items-center justify-center">
        <Calendar />
      </div>

      {/* 영역 3 */}
      <div className="border flex items-center justify-center">
        <CalendarEvent />
      </div>

      {/* 영역 4 */}
      <div className="border flex items-center justify-center">4</div>
    </div>
  );
}

export default CalendarPage;
