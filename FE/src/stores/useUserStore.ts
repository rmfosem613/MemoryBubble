import { create } from 'zustand';

// 타입
export interface User {
  userId: number | null;
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
  gender: 'F' | 'M' | '';
  familyId: number | null;
}

interface FamilyMember {
  userId: number | null;
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
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
  setIsUnread: (show: boolean) => void;
  resetUser: () => void;
}

// 초기 상태
const initialUser: User = {
  userId: null,
  name: '',
  profileUrl: '',
  birth: '',
  phoneNumber: '',
  gender: '',
  familyId: null,
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
  setUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...userData }
    })),
  
  setFamily: (familyData) =>
    set((state) => ({
      family: { ...state.family, ...familyData }
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
