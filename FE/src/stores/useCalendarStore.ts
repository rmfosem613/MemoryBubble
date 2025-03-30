import { create } from 'zustand';
interface CalendarStore {
  currentDate: Date;
  selectDate: Date;
  nextMonth: () => void;
  prevMonth: () => void;
  setSelectDate: (year: number, month: number, day: number) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  currentDate: new Date(),
  selectDate: new Date(new Date().setHours(0, 0, 0, 0)),

  nextMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return { currentDate: newDate };
    }),

  prevMonth: () =>
    set((state) => {
      const newDate = new Date(state.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return { currentDate: newDate };
    }),

  setSelectDate: (year, month, day) =>
    set(() => ({
      selectDate: new Date(year, month, day),
    })),
}));
