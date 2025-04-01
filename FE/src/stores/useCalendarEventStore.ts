import { create } from 'zustand';

interface CalendarEvent {
  scheduleId: number;
  scheduleContent: string;
  startDate: string;
  endDate: string;
  albumId: number | null;
}

interface CalendarEventStore {
  selectDate: Date;
  events: CalendarEvent[];

  setSelectDate: (date: Date) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (scheduleId: number) => void;
  updateEvent: (
    scheduleId: number,
    updatedEvent: Partial<Omit<CalendarEvent, 'scheduleId'>>,
  ) => void;
  getEventsByDate: (date: Date) => CalendarEvent[];
}

export const useCalendarEventStore = create<CalendarEventStore>((set, get) => ({
  selectDate: new Date(new Date().setHours(0, 0, 0, 0)),
  events: [
    {
      scheduleId: 101,
      scheduleContent: '제주도 여행',
      startDate: '2025-04-01',
      endDate: '2025-04-03',
      albumId: 201,
    },
    {
      scheduleId: 103,
      scheduleContent: '생일 파티 준비',
      startDate: '2025-04-08',
      endDate: '2025-04-08',
      albumId: 202,
    },
    {
      scheduleId: 109,
      scheduleContent: '생일 파티 준비',
      startDate: '2025-04-08',
      endDate: '2025-04-08',
      albumId: 202,
    },
    {
      scheduleId: 12,
      scheduleContent: '생일 파티 준비',
      startDate: '2025-04-08',
      endDate: '2025-04-08',
      albumId: 202,
    },
    {
      scheduleId: 104,
      scheduleContent: '웹 개발 컨퍼런스',
      startDate: '2025-04-08',
      endDate: '2025-04-12',
      albumId: null,
    },
  ],

  // 선택된 날짜
  setSelectDate: (date) => set({ selectDate: date }),

  // 이벤트 추가 함수
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  // 이벤트 삭제 함수
  removeEvent: (scheduleId) =>
    set((state) => ({
      events: state.events.filter((event) => event.scheduleId !== scheduleId),
    })),

  // 이벤트 수정 함수
  updateEvent: (scheduleId, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.scheduleId === scheduleId ? { ...event, ...updatedEvent } : event,
      ),
    })),

  // 특정 날짜에 해당하는 이벤트 찾기 함수
  getEventsByDate: (date: Date) => {
    return get().events.filter((event) => {
      const startDate = new Date(event.startDate + 'T00:00:00');
      const endDate = new Date(event.endDate + 'T00:00:00');

      // 대상 날짜가 시작일과 종료일 사이에 있는지 확인
      return date >= startDate && date <= endDate;
    });
  },
}));
