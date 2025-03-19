import { useCallback } from 'react';

interface UseFontDownloadOptions {
  fontName: string;
  text: string;
}

interface UseFontDownloadReturn {
  downloadFont: () => void;
  resetFont: () => void;
}

export const useFontDownload = ({
  fontName,
  text,
}: UseFontDownloadOptions): UseFontDownloadReturn => {
  const downloadFont = useCallback(() => {
    console.log(`다운로드: ${fontName} 폰트 (텍스트: ${text})`);
  }, [fontName, text]);

  const resetFont = useCallback(() => {
    console.log('폰트 재설정: 기존 폰트 삭제 및 다시 만들기');
    // 실제 폰트 재설정 로직 구현 필요
  }, []);

  return {
    downloadFont,
    resetFont,
  };
};

export default useFontDownload;
