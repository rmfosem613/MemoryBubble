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
  today: Date;
  startYear: number; // 표시 가능한 시작 연도
  endYear: number; // 표시 가능한 종료 연도

  setSelectDate: (date: Date) => void;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (scheduleId: number) => void;
  updateEvent: (
    scheduleId: number,
    updatedEvent: Partial<Omit<CalendarEvent, 'scheduleId'>>,
  ) => void;
  getEventsByDate: (date: Date) => CalendarEvent[];
}

const useCalendarEventStore = create<CalendarEventStore>((set, get) => {
  // 현재 날짜 계산
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const startYear = today.getFullYear() - 50;
  const endYear = today.getFullYear() + 51;

  return {
    today,
    startYear,
    endYear,
    selectDate: new Date(today), // 오늘 날짜로 초기화
    events: [],

    // 선택된 날짜
    setSelectDate: (date) => set({ selectDate: date }),

    // 이벤트
    setEvents: (events) => set({ events }),

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
          event.scheduleId === scheduleId
            ? { ...event, ...updatedEvent }
            : event,
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
  };
});

export default useCalendarEventStore;
