import React, { useState, useMemo } from 'react';
import { CirclePlus, Link, Trash2, PenLine } from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';

function CalendarEventRender() {
  const { selectDate } = useCalendarStore();
  const [openEvents, setOpenEvents] = useState<Record<number, boolean>>({});

  // 임시 이벤트 데이터
  const events = [
    {
      scheduleId: 101,
      scheduleContent: '제주도 여행',
      startDate: '2025-03-01',
      endDate: '2025-03-03',
      albumId: 201,
    },
    {
      scheduleId: 103,
      scheduleContent: '생일 파티 준비',
      startDate: '2025-03-08',
      endDate: '2025-03-08',
      albumId: 202,
    },
    {
      scheduleId: 104,
      scheduleContent: '웹 개발 컨퍼런스',
      startDate: '2025-03-08',
      endDate: '2025-03-12',
      albumId: null,
    },
  ];

  const toggleEvent = (scheduleId: number) => {
    setOpenEvents((prev) => ({
      ...prev,
      [scheduleId]: !prev[scheduleId],
    }));
  };

  // 선택된 날짜에 해당하는 이벤트 필터링
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const startDate = new Date(event.startDate + 'T00:00:00');
      const endDate = new Date(event.endDate + 'T00:00:00');

      // 선택된 날짜가 이벤트 기간 내에 있는지 확인
      return startDate <= selectDate && selectDate <= endDate;
    });
  }, [events, selectDate]);

  return (
    <div className="w-full h-full px-6 py-3 flex flex-col space-y-3">
      {/* -- 일정 헤더 -- */}
      <div className="flex justify-between">
        {/* 선택날짜 */}
        <h2 className="text-h3-lg font-p-700">
          {selectDate.getMonth() + 1}월 {selectDate.getDate()}일
        </h2>
        {/* 일정추가 */}
        <div className="flex items-center">
          <CirclePlus size={17} />
          <span className="text-subtitle-1-lg font-p-500">일정 추가</span>
        </div>
      </div>

      {/* -- 일정 목록 -- */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.scheduleId} className="mb-3">
              {/* 일정 */}
              <div
                className="flex flex-col pb-2 border-b-2 border-dashed border-winter-200 cursor-pointer"
                onClick={() => toggleEvent(event.scheduleId)}>
                <div className="px-2 flex justify-between items-center">
                  <p className="p-1 text-h5-lg font-p-500">
                    {event.scheduleContent}
                  </p>
                  {event.albumId ? <Link size={18} strokeWidth={2} /> : ''}
                </div>
                {/* 일정상세 */}
                {openEvents[event.scheduleId] && (
                  <div className="flex flex-col space-y-1 p-3 pb-1 bg-white text-subtitle-1-lg font-p-500">
                    <p>
                      {event.startDate.replace(/-/g, '/')} ~{' '}
                      {event.endDate.replace(/-/g, '/')}
                    </p>
                    <div
                      className={`flex items-center space-x-1 ${event.albumId ? 'text-winter-300 font-p-700' : 'text-gray-400'}`}>
                      <Link size={15} strokeWidth={event.albumId ? 3 : 2} />
                      <p>{event.albumId ? '앨범이름' : '앨범 연결'}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 rounded-full hover:bg-winter-100">
                        <PenLine size={18} />
                      </button>
                      <button className="p-1 rounded-full hover:bg-winter-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-winter-200">
            해당 날짜에 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarEventRender;
