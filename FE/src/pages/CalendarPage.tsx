import React from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import Calendar from '@/components/calendar/Calendar';
import CalendarEvent from '@/components/calendar/CalendarEvent';

function CalendarPage() {
  return (
    <div className="flex h-screen w-full justify-center ">
      {/* 왼쪽 헤더 영역 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block flex-1 h-[729px] w-full">
        <CalendarHeader />
      </div>

      {/* 중앙 콘텐츠 영역 */}
      <div className="h-full w-full px-[1rem] sm:px-0 flex flex-col lg:flex-row sm:w-[576px] md:w-[672px] lg:w-[832px] xl:w-[980px]">
        {/* 캘린더 영역 */}
        <div className="min-h-[250px] h-[490px] w-full lg:w-[65%] lg:h-[720px] bg-white pt-[65px] px-2 mb-2">
          <Calendar />
        </div>

        {/* 이벤트 영역 */}
        <div className="flex-1 min-h-40 w-full lg:w-[35%] lg:h-[470px] mb-2 px-2 lg:px-0 lg:shadow-md">
          <CalendarEvent />
        </div>
      </div>

      {/* 오른쪽 여백 영역 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block flex-1 h-[729px] w-full">
        {/* 비어있는 영역 */}
      </div>
    </div>
  );
}

export default CalendarPage;
