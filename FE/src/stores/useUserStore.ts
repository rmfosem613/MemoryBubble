import { create } from 'zustand';

// 타입
export interface User {
  userId: number | null;
  name: string | null;
  profileUrl: string | null;
  birth: string | null;
  phoneNumber: string | null;
  gender: 'F' | 'M' | null;
  familyId: number | null;
  role: 'USER' | 'ADMIN' | null;
}

interface FamilyMember {
  userId: number | null;
  name: string | null;
  profileUrl: string | null;
  birth: string | null;
  phoneNumber: string | null;
}

export interface Family {
  familyName: string;
  thumbnailUrl: string;
  familyMembers: FamilyMember[];
}

interface UserStore {
  user: User;
  family: Family;
  isUnread: boolean;

  setUser: (user: Partial<User>) => void;
  setFamily: (family: Partial<Family>) => void;
  setIsUnread: (isUnread: boolean) => void;
  resetUser: () => void;
}

// 초기 상태
const initialUser: User = {
  userId: null,
  name: null,
  profileUrl: null,
  birth: null,
  phoneNumber: null,
  gender: null,
  familyId: null,
  role: null,
};

const initialFamily: Family = {
  familyName: '',
  thumbnailUrl: '',
  familyMembers: [],
};

// 스토어
const useUserStore = create<UserStore>((set) => ({
  // 상태
  user: initialUser,
  family: initialFamily,
  isUnread: false,

  // 액션
  setUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user },
    })),

  setFamily: (family) =>
    set((state) => ({
      family: { ...state.family, ...family },
    })),

  setIsUnread: (isUnread) => set({ isUnread }),

  resetUser: () =>
    set({
      user: initialUser,
      family: initialFamily,
      isUnread: false,
    }),
}));

export default useUserStore;
