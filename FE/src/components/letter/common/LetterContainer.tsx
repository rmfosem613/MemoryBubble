import { ReactNode } from 'react';
import { ColorTheme } from '@/types/Letter';

interface LetterContainerProps {
  children: ReactNode;
  className?: string;
  selectedColor?: ColorTheme;
}

/**
 * 모든 편지 유형에 사용될 수 있는 공통 컨테이너 컴포넌트
 */
function LetterContainer({ children, className = '' }: LetterContainerProps) {
  return (
    <div className={`border-2 border-gray-300 rounded-[8px] p-5 relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export default LetterContainer;