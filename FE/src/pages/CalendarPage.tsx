import React from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import Calendar from '@/components/calendar/Calendar';
import CalendarEvent from '@/components/calendar/CalendarEvent';

function CalendarPage() {
  return (
    <div className="pt-[65px] h-screen flex space-x-3 justify-center items-center">
      <CalendarHeader />
      <div className="min-w-[1024px]">
        <Calendar />
      </div>
      <CalendarEvent />
    </div>
  );
}

export default CalendarPage;
