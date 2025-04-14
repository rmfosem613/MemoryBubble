// 편지 타입 정의
export type LetterType = 'TEXT' | 'AUDIO';

// 색상 테마 타입 정의
export type ColorTheme = 'spring' | 'summer' | 'autumn' | 'winter' | null;

// 색상 옵션 정의
export interface ColorOption {
  id: ColorTheme;
  className: string;
  waveColor: string;
}

// 멤버 타입 정의
export interface LetterMember {
  id: string;
  label: string;
}

// 페이지 타입 정의
export interface Page {
  lines: string[];
  previous?: string;
}

// 카세트 데이터 타입 정의
export interface CassetteData {
  isRecorded?: boolean;
  recordingUrl?: string | null;
  recordingDuration?: number;
}

// 편지 상태 인터페이스
export interface LetterState {
  // 편지 타입
  letterType: LetterType;
  cassetteData: CassetteData;

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

// 편지 보관함 편지 타입 정의
export interface LetterData {
  letterId: number;
  type: 'TEXT' | 'AUDIO';
  backgroundColor: 'spring' | 'summer' | 'autumn' | 'winter';
  senderName: string;
  isRead: boolean;
  openAt: string;
  // createdAt: string; 이거는 안쓰는거 같아서 주석처리
  // contents?: string; 이거는 편지 상세에서만 필요
}

// 편지 보관함 타입
export type StorageType = 'new' | 'received';
