import { useState } from 'react';

interface UseFontReturn {
  font: string;
  text: string;
  fontSize: number;
  setText: (text: string) => void;
  setFontSize: (size: number) => void;
  setFont: (font: string) => void;
  resetText: () => void;
}
export const useFont = (
  initialFont: string = '막내아들 글씨체',
  initialFontSize: number = 40,
): UseFontReturn => {
  const [font, setFont] = useState<string>(initialFont);
  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(initialFontSize);

  const resetText = () => {
    setText('');
  };

  return {
    font,
    text,
    fontSize,
    setText,
    setFontSize,
    setFont,
    resetText,
  };
};

export default useFont;
