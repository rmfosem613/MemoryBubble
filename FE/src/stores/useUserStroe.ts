import { create } from 'zustand';

// 사용자 정보 타입
interface User {
  user_id: number;
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  familyId: number;
  ismail: boolean;
}

// 그룹 정보 타입
interface FamilyInfo {
  familyName: string;
  thumbnailUrl: string;
  familyMembers: FamilyMember[];
}

// 가족 구성원 타입
interface FamilyMember {
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
}

// 사용자 스토어 타입
interface UserState {
  user: User | null;
  familyInfo: FamilyInfo | null;
  setUser: (user: User) => void;
  setFamilyInfo: (familyInfo: FamilyInfo) => void;
  clearUser: () => void;
}

// 임시 데이터
const tempUser: User = {
  user_id: 1,
  name: '김철수',
  profileUrl:
    'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20240613_174%2F1718269521131oELlC_JPEG%2Fmovie_image.jpg',
  birth: '1988-05-15',
  phoneNumber: '010-1234-5678',
  gender: 'male',
  familyId: 1,
  ismail: true,
};

const tempFamilyInfo: FamilyInfo = {
  familyName: '김씨네 가족',
  thumbnailUrl:
    'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20240612_151%2F1718180074487NH0V5_JPEG%2Fmovie_image.jpg',
  familyMembers: [
    {
      name: '엄마',
      profileUrl:
        'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20240613_45%2F1718269363185rpYkA_JPEG%2Fmovie_image.jpg',
      birth: '1965-03-22',
      phoneNumber: '010-0000-0000',
    },
    {
      name: '아빠',
      profileUrl:
        'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20240613_247%2F1718269380450qw62Y_JPEG%2Fmovie_image.jpg',
      birth: '1962-12-10',
      phoneNumber: '010-1111-1111',
    },
    {
      name: '동생',
      profileUrl:
        'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20240613_80%2F17182694165734L0aD_JPEG%2Fmovie_image.jpg',
      birth: '1992-07-08',
      phoneNumber: '010-2222-2222',
    },
  ],
};

export const useUserStore = create<UserState>((set) => ({
  user: tempUser,
  familyInfo: tempFamilyInfo,

  // 사용자 정보 설정
  setUser: (user) => set({ user }),

  // 가족 정보 설정
  setFamilyInfo: (familyInfo) => set({ familyInfo }),

  // 사용자 정보 초기화
  clearUser: () => set({ user: null, familyInfo: null }),
}));
