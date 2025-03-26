import { create } from 'zustand';

// 타입
export interface User {
  user_id: number;
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
  gender: 'F' | 'M' | '';
  familyId: number;
}

interface FamilyMember {
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

  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  setFamily: (family: Family) => void;
  updateFamilyName: (name: string) => void;
  setIsUnread: (show: boolean) => void;
  resetUser: () => void;
}

// 초기 상태
const initialUser: User = {
  user_id: 0,
  name: '',
  profileUrl: '',
  birth: '',
  phoneNumber: '',
  gender: '',
  familyId: 0,
};

const initialFamily: Family = {
  familyName: '',
  thumbnailUrl: '',
  familyMembers: [],
};

// 초기값 체크
const isInitialUser = (user: User): boolean => {
  return user.user_id === 0 && user.name === '' && user.familyId === 0;
};

const isInitialFamily = (family: Family): boolean => {
  return family.familyName === '' && family.familyMembers.length === 0;
};

// 스토어
const useUserStore = create<UserStore>((set) => ({
  // 상태
  user: initialUser,
  family: initialFamily,
  isUnread: false,

  // 액션
  setUser: (user) => set({ user }),
  updateUser: (userData) =>
    set((state) => {
      // 초기값인 경우 업데이트하지 않음
      if (isInitialUser(state.user)) {
        console.warn(
          '실제 사용자 데이터가 로드되기 전에는 업데이트할 수 없습니다.',
        );
        return state;
      }
      return { user: { ...state.user, ...userData } };
    }),
  setFamily: (family) => set({ family }),
  updateFamilyName: (familyName) =>
    set((state) => {
      // 초기값인 경우 업데이트하지 않음
      if (isInitialFamily(state.family)) {
        console.warn(
          '실제 가족 데이터가 로드되기 전에는 업데이트할 수 없습니다.',
        );
        return state;
      }
      return { family: { ...state.family, familyName } };
    }),
  setIsUnread: (isUnread) => set({ isUnread }),
  resetUser: () =>
    set({
      user: initialUser,
      family: initialFamily,
      isUnread: false,
    }),
}));

export default useUserStore;
