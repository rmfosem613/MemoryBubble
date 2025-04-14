import { useState } from 'react';

interface UseFontReturn {
  text: string;
  fontSize: number;
  setText: (text: string) => void;
  setFontSize: (size: number) => void;
}
export const useFont = (initialFontSize: number = 40): UseFontReturn => {
  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(initialFontSize);

  return {
    text,
    fontSize,
    setText,
    setFontSize,
  };
};

export default useFont;
