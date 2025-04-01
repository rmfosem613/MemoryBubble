import { useState, useCallback } from 'react';
import { useLetterStore } from '@/stores/useLetterStore';
import { LetterMember, ColorTheme } from '@/types/Letter';

interface LetterFormReturn {
  // 텍스트 편지 관련 상태 및 기능
  letterContent: string;
  setLetterContent: (content: string) => void;

  // 받는 사람 선택 관련
  selectedMember: LetterMember | null;
  handleMemberSelect: (member: LetterMember) => void;

  // 편지 색상 선택 관련
  selectedColor: ColorTheme;
  handleColorSelect: (colorId: string) => void;

  // 느린 편지 날짜 설정
  deliveryDate: Date | null;
  setDeliveryDate: (date: Date | null) => void;

  // 편지 전송
  sendLetter: () => Promise<boolean>;
  isSending: boolean;

  // 편지 폼 초기화
  resetForm: () => void;
}


// 텍스트 입력, 멤버 선택, 색상 선택, 날짜 설정 등의 기능을 제공합니다.
export function useLetterForm(): LetterFormReturn {
  const {
    selectedMember,
    setSelectedMember,
    selectedColor,
    setSelectedColor,
    letterType,
  } = useLetterStore();

  // 텍스트 편지 내용
  const [letterContent, setLetterContent] = useState<string>('');

  // 느린 편지 배송 날짜
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  // 전송 상태
  const [isSending, setIsSending] = useState(false);

  // 멤버 선택 핸들러
  const handleMemberSelect = useCallback((member: LetterMember) => {
    setSelectedMember(member);
  }, [setSelectedMember]);

  // 색상 선택 핸들러
  const handleColorSelect = useCallback((colorId: string) => {
    setSelectedColor(colorId as ColorTheme);
  }, [setSelectedColor]);

  // 편지 전송 함수
  const sendLetter = useCallback(async (): Promise<boolean> => {
    if (!selectedMember) {
      alert('받는 사람을 선택해주세요.');
      return false;
    }

    if (letterType === 'TEXT' && !letterContent.trim()) {
      alert('편지 내용을 입력해주세요.');
      return false;
    }

    try {
      setIsSending(true);

      // TODO: 실제 API 호출 로직 구현
      // 텍스트 편지 또는 카세트 편지 전송 로직

      // 성공 시 초기화
      resetForm();
      return true;
    } catch (error) {
      console.error('편지 전송 중 오류가 발생했습니다:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [selectedMember, letterType, letterContent]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setLetterContent('');
    setDeliveryDate(null);
  }, []);

  return {
    letterContent,
    setLetterContent,
    selectedMember,
    handleMemberSelect,
    selectedColor,
    handleColorSelect,
    deliveryDate,
    setDeliveryDate,
    sendLetter,
    isSending,
    resetForm
  };
}