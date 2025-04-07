import { create } from 'zustand';

// 편지 타입 정의
type LetterType = 'TEXT' | 'AUDIO';

// 색상 테마 타입 정의
type ColorTheme = 'spring' | 'summer' | 'autumn' | 'winter' | null;

// 카세트 데이터 타입 정의
interface CassetteData {
  isRecorded?: boolean;
  isRecording?: boolean;
  recordingUrl?: string | null;
  recordingDuration?: number;
}

// 멤버 타입 정의
interface LetterMember {
  id: string;
  label: string;
}

// 편지 상태 인터페이스
interface LetterState {

  // 편지 타입
  letterType: LetterType;
  cassetteData: CassetteData;

  // 텍스트 편지 내용
  textContent: string;
  setTextContent: (content: string) => void;

  // 색상 테마
  selectedColor: ColorTheme;
  setSelectedColor: (color: ColorTheme) => void;

  // 멤버 선택
  selectedMember: LetterMember | null;
  setSelectedMember: (member: LetterMember | null) => void;

  // 카세트 편지 관련 상태관리
  setLetterType: (type: LetterType) => void;
  updateCassetteData: (data: Partial<CassetteData>) => void;
}

// Zustand 스토어 생성
export const useLetterStore = create<LetterState>((set) => ({
  // 텍스트 편지 초기값
  letterType: 'TEXT',
  cassetteData: {
    isRecorded: false,
    isRecording: false,
    recordingUrl: null,
    recordingDuration: 0
  },

  // 텍스트 편지 내용
  textContent: '',
  setTextContent: (content) => set({ textContent: content }),

  // 색상 테마 초기값 - winter로 설정
  selectedColor: 'winter',
  setSelectedColor: (color) => set({ selectedColor: color }),

  // 멤버 초기값
  selectedMember: null,
  setSelectedMember: (member) => set({ selectedMember: member }),

  // 카세트 관련 함수
  setLetterType: (type) => set({ letterType: type }),
  updateCassetteData: (data) => set((state) => ({
    cassetteData: { ...state.cassetteData, ...data }
  }))
}));


// 편지 보관함 타입
type StorageType = 'new' | 'received';

// 편지 보관함 인터페이스
interface StorageState {

  // 편지 타입
  storageType: StorageType;
}

export const useBoxStore = create<StorageState>(() => ({
  // 텍스트 편지 초기값
  storageType: 'new',
}));