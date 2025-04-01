import React from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import Calendar from '@/components/calendar/Calendar';
import CalendarEvent from '@/components/calendar/CalendarEvent';

function CalendarPage() {
  return (
    <div className="flex w-full h-screen">
      <div className="flex-1 hidden lg:block">
        <CalendarHeader />
      </div>

      <div className="container flex flex-col lg:flex-row w-full h-full">
        <div className="w-full h-full lg:h-full lg:w-[65%] p-2 pt-[65px] mb-2">
          <Calendar />
        </div>
        <div className="w-full min-h-[300px] lg:h-[400px] lg:w-[35%] bg-winter-100 shadow-md">
          <CalendarEvent />
        </div>
      </div>

      <div className="flex-1 hidden lg:block"></div>
    </div>
  );
}

export default CalendarPage;
