import { create } from 'zustand';

// 이벤트 타입
export interface CalendarEvent {
  scheduleId: number;
  scheduleContent: string;
  startDate: string;
  endDate: string;
  albumId: number | null;
}

// 이벤트 스토어 타입
interface CalendarEventStore {
  events: CalendarEvent[];
}

export const useCalendarEventStore = create<CalendarEventStore>(() => ({
  // 초기 이벤트 데이터
  events: [
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
  ],
}));
