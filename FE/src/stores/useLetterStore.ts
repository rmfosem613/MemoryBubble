import { create } from 'zustand';

// 편지 타입 정의
type LetterType = 'text' | 'cassette';

// 색상 테마 타입 정의
type ColorTheme = 'spring' | 'summer' | 'autumn' | 'winter' | null;

// 페이지 타입 정의
interface Page {
  lines: string[];
  previous?: string;
}

// 카세트 데이터 타입 정의
interface CassetteData {
  isRecorded?: boolean;
}

// 편지 상태 인터페이스
interface LetterState {
  
  // 편지 타입
  letterType: LetterType;
  cassetteData?: CassetteData;
  
  // 색상 테마
  selectedColor: ColorTheme;
  setSelectedColor: (color: ColorTheme) => void;

  // 텍스트 편지 페이지
  pages: Page[];
  currentPage: number;
  
  // 텍스트 편지 관련 상태관리
  setPages: (pages: Page[]) => void;
  setCurrentPage: (page: number) => void;
  updateLine: (pageIndex: number, lineIndex: number, content: string) => void;
  addPage: (pageData?: Partial<Page>) => void;
  updatePagePrevious: (pageIndex: number, content: string) => void;
  clearPrevious: (pageIndex: number) => void;
  
  // 카세트 편지 관련 상태관리
  setLetterType: (type: LetterType) => void;
  updateCassetteData: (data: Partial<CassetteData>) => void;
}

// Zustand 스토어 생성
export const useLetterStore = create<LetterState>((set) => ({
  // 텍스트 편지 초기값
  pages: [{ lines: Array(9).fill('') }],
  currentPage: 0,
  letterType: 'text',
  cassetteData: {
    isRecorded: false
  },
  
  // 색상 테마 초기값
  selectedColor: null,
  setSelectedColor: (color) => set({ selectedColor: color }),
  
  // 페이지 배열
  setPages: (pages) => set({ pages }),
  
  // 현재 페이지
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // 새로운 편지 생성 시, 편지지 선 추가
  updateLine: (pageIndex, lineIndex, content) => set((state) => {
    const newPages = [...state.pages];
    if (newPages[pageIndex]) {
      const newLines = [...newPages[pageIndex].lines];
      newLines[lineIndex] = content;
      newPages[pageIndex] = { ...newPages[pageIndex], lines: newLines };
    }
    return { pages: newPages };
  }),

  // 새 페이지 추가
  addPage: (pageData) => set((state) => {
    const newPage: Page = {
      lines: Array(9).fill(''),
      ...pageData
    };
    return {
      pages: [...state.pages, newPage],
      currentPage: state.pages.length
    };
  }),

  // 이전 페이지에서 넘어온 텍스트(previous) 저장
  updatePagePrevious: (pageIndex, content) => set((state) => {
    const newPages = [...state.pages];
    if (newPages[pageIndex]) {
      newPages[pageIndex] = { ...newPages[pageIndex], previous: content };
    }
    return { pages: newPages };
  }),

  // 이전 페이지에서 넘어온 텍스트(previous) 초기화
  clearPrevious: (pageIndex) => set((state) => {
    const newPages = [...state.pages];
    if (newPages[pageIndex]) {
      const { previous, ...rest } = newPages[pageIndex];
      newPages[pageIndex] = { ...rest };
    }
    return { pages: newPages };
  }),
  
  // 카세트 관련 함수
  setLetterType: (type) => set({ letterType: type }),
  updateCassetteData: (data) => set((state) => ({
    cassetteData: { ...state.cassetteData, ...data }
  }))
}));