import { create } from 'zustand';
import { CalendarStore } from '@/types/CalendarType';

const useCalendarStore = create<CalendarStore>((set) => ({
  currentDate: new Date(),

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
}));

export default useCalendarStore;
