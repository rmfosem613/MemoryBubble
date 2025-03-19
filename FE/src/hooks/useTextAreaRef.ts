import { useRef, useEffect, useState } from 'react';

export const useTextAreaRef = (autoFocus: boolean = false) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [currentFontFamily, setCurrentFontFamily] = useState('pretendard');

  useEffect(() => {
    if (autoFocus && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [autoFocus]);

  const focusTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  return {
    textAreaRef,
    focusTextArea,
    currentFontFamily,
    setCurrentFontFamily,
  };
};

export default useTextAreaRef;
