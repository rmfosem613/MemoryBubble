import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean; // 모달 열림/닫힘 상태
  onClose: () => void; // 닫기 함수 추가
  title: string; // 제목
  children: ReactNode; // 본문
  primaryButtonText?: string; // 주요 버튼 텍스트
  secondaryButtonText?: string; // 보조 버튼 텍스트
  onPrimaryButtonClick?: () => void; // 주요 버튼 이벤트 핸들러
  onSecondaryButtonClick?: () => void; // 보조 버튼 이벤트 핸들러
}
