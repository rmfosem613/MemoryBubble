// Calendar.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';

const Calendar = () => {
  const { currentDate, dayNames, days, nextMonth, prevMonth } = useCalendar();

  return (
    <div className="flex flex-col w-full h-full p-4 border">
      {/* 달력 헤더 */}
      <div className="flex justify-center items-center space-x-2 mb-3">
        <button
          onClick={prevMonth}
          className="rounded-full hover:bg-winter-100 focus:outline-none transition-colors duration-300 ease-in-out">
          <ChevronLeft strokeWidth={3} size={28} />
        </button>

        <h2 className="text-h3-lg font-p-700">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>

        <button
          onClick={nextMonth}
          className="rounded-full hover:bg-winter-100 focus:outline-none transition-colors duration-300 ease-in-out">
          <ChevronRight strokeWidth={3} size={28} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className={`text-h5-lg font-p-700 text-end px-3
              ${day === '일' ? 'text-red-300' : day === '토'? 'text-blue-700' : ''}
            `}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="flex-1 grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
            relative min-h-20 flex items-center justify-center rounded-[4px] border-2 border-winter-100 transition-colors duration-300 ease-in-out 
              ${!day.date ? 'invisible' : 'cursor-pointer'}
            `}>
            {/* 날짜(일) 표시 */}
            <div className="absolute top-1 right-2">
              <span
                className={`text-h5-lg ${day.isToday ? 'bg-winter-200 text-white px-1.5 py-1 rounded-full' : ''}`}>
                {day.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
