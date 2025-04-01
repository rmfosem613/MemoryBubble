import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { DateClickArg } from '@fullcalendar/interaction';

import { useCalendarEventStore } from '@/stores/useCalendarEventStore';
import './CalendarStyle.css';

const Calendar = () => {
  const { events, selectDate, setSelectDate } = useCalendarEventStore();

  // FullCalendar 형식에 맞게 이벤트 데이터 변환
  const calendarEvents = events.map((event) => {
    // 연속 일정인지 확인
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const isMultiDay = endDate.getTime() > startDate.getTime();

    // endDate를 하루 늘려서 종료일을 포함하도록 설정
    const adjustedEndDate = new Date(event.endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    return {
      id: String(event.scheduleId),
      title: event.scheduleContent,
      start: event.startDate,
      end: adjustedEndDate.toISOString().split('T')[0],
      allDay: true,
      classNames: isMultiDay
        ? ['multi-day-event', 'text-center', 'bg-winter-300', 'px-2', 'mb-0.5']
        : [
            'single-day-event',
            'px-1',
            'bg-winter-100',
            'border-winter-200',
            'rounded-none',
            'border-l-4',
            'border-t-0',
            'border-r-0',
            'border-b-0',
            'mb-0.5',
          ],
      textColor: isMultiDay ? 'white' : 'black',
      extendedProps: {
        albumId: event.albumId,
      },
    };
  });

  // 한국어 로케일 커스터마이징 (일을 제거하기 위한 설정)
  const customLocale = {
    ...koLocale,
    dayCellContent: (info) => {
      return info.date.getDate(); // 날짜(숫자)만 반환
    },
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (info: DateClickArg) => {
    setSelectDate(info.date);
  };

  // 날짜 셀 클래스 설정 - 선택된 날짜에 특별한 클래스 추가
  const handleDayCellClassNames = (arg: { date: Date }) => {
    // 일(day) 단위로만 비교 (년, 월, 일이 동일한지)
    return arg.date.getFullYear() === selectDate.getFullYear() &&
      arg.date.getMonth() === selectDate.getMonth() &&
      arg.date.getDate() === selectDate.getDate()
      ? ['selected-date']
      : [];
  };

  // 월 변경 시 해당 월의 1일로 선택 업데이트
  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    console.log('월 변경 감지!', {
      startDate: arg.start,
      endDate: arg.end,
      year: arg.start.getFullYear(),
      month: arg.start.getMonth() + 1,
    });

    const firstDayOfMonth = new Date(arg.start);
    firstDayOfMonth.setDate(1);

    // 이전 선택 날짜와 비교하여 year 또는 month가 변경된 경우에만 업데이트
    if (
      selectDate.getFullYear() !== firstDayOfMonth.getFullYear() ||
      selectDate.getMonth() !== firstDayOfMonth.getMonth()
    ) {
      setSelectDate(firstDayOfMonth);
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]} // 월간 달력 표시와 사용자 상호작용을 위한 플러그인
        initialView="dayGridMonth" // 처음 렌더링 시 월간 보기로 표시
        locale="ko" // 달력의 언어를 한국어로 설정
        locales={[customLocale]} // 한국어 로케일 정보 제공
        headerToolbar={{
          left: '', // 왼쪽 영역은 비움
          center: 'prev title next', // 중앙에 이전 달, 제목, 다음 달 버튼 배치
          right: 'today', // 오른쪽에 오늘 버튼 배치
        }}
        showNonCurrentDates={false} // 이전/다음 달의 날짜를 표시하지 않음
        fixedWeekCount={false} // 항상 6주를 표시하지 않고 실제 필요한 주 수만 표시
        events={calendarEvents} // 표시할 일정 데이터 배열
        dateClick={handleDateClick} // 날짜 셀 클릭 시 실행할 함수
        height="100%" // 달력 높이를 컨텐츠에 맞게 자동 조정
        dayMaxEvents={2} // 하루에 표시할 최대 이벤트 수
        dayCellClassNames={handleDayCellClassNames} // 날짜 셀에 적용할 클래스 결정 함수
        eventClassNames="pointer-events-none"
        moreLinkClassNames="pointer-events-none"
        datesSet={handleDatesSet}
      />
    </>
  );
};

export default Calendar;

// import React from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useCalendar } from '@/hooks/useCalendar';
// import { useCalendarStore } from '@/stores/useCalendarStore';

// const Calendar = () => {
//   const { dayNames, days } = useCalendar();

//   const { currentDate, selectDate, nextMonth, prevMonth, setSelectDate } =
//     useCalendarStore();

//   return (
//     <div className="flex flex-col w-full h-full p-4 border">
//       {/* 달력 헤더 */}
//       <div className="flex justify-center items-center space-x-2 mb-3">
//         <button
//           onClick={prevMonth}
//           className="rounded-full hover:bg-winter-100 focus:outline-none transition-colors duration-300 ease-in-out">
//           <ChevronLeft strokeWidth={3} size={28} />
//         </button>

//         <h2 className="text-h3-lg font-p-700">
//           {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
//         </h2>

//         <button
//           onClick={nextMonth}
//           className="rounded-full hover:bg-winter-100 focus:outline-none transition-colors duration-300 ease-in-out">
//           <ChevronRight strokeWidth={3} size={28} />
//         </button>
//       </div>

//       {/* 요일 헤더 */}
//       <div className="grid grid-cols-7 gap-1 mb-3">
//         {dayNames.map((day, index) => (
//           <div
//             key={index}
//             className={`text-h5-lg font-p-700 text-end px-3
//               ${day === '일' ? 'text-red-300' : day === '토' ? 'text-blue-700' : ''}
//             `}>
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* 날짜 그리드 */}
//       <div className="flex-1 grid grid-cols-7 gap-1">
//         {days.map((day, index) => (
//           <div
//             key={index}
//             onClick={() =>
//               day.date &&
//               setSelectDate(
//                 currentDate.getFullYear(),
//                 currentDate.getMonth(),
//                 day.date,
//               )
//             }
//             className={`
//             relative min-h-20 flex items-center justify-center rounded-[4px] border-2 transition-colors duration-300 ease-in-out
//               ${!day.date ? 'invisible' : 'cursor-pointer'} ${day.isSelect ? 'border-winter-200' : 'border-winter-100'}
//             `}>
//             {/* 날짜(일) 표시 */}
//             <div className="absolute top-1 right-2">
//               <span
//                 className={`text-h5-lg ${day.isToday ? 'bg-winter-200 text-white px-1.5 py-1 rounded-full' : ''}`}>
//                 {day.date}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Calendar;
