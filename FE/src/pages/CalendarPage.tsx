import React from 'react';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import Calendar from '@/components/calendar/Calendar';
import CalendarEvent from '@/components/calendar/CalendarEvent';

function CalendarPage() {
  return (
    <div className="flex h-screen w-full justify-center pb-2 lg:pb-0 ">
      {/* 왼쪽 헤더 영역 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block flex-1 h-full w-full">
        <CalendarHeader />
      </div>

      {/* 중앙 콘텐츠 영역 */}
      <div className="h-full w-full mb-1 px-[1rem] sm:px-0 flex flex-col gap-1.5 lg:px-1 lg:flex-row sm:w-[576px] md:w-[672px] lg:w-[832px] xl:w-[980px]">
        {/* 캘린더 영역 */}
        <div className="w-full min-h-[470px] lg:w-[65%] lg:h-full pt-[60px] bg-white">
          <Calendar />
        </div>

        {/* 이벤트 영역 */}
        <div className="min-h-[210px] flex-1 w-full lg:w-[35%] lg:h-[470px] lg:shadow-md">
          <CalendarEvent />
        </div>
      </div>

      {/* 오른쪽 여백 영역 - 데스크톱에서만 표시 */}
      <div className="hidden lg:block flex-1 h-full w-full">
        {/* 비어있는 영역 */}
      </div>
    </div>
  );
}

export default CalendarPage;
