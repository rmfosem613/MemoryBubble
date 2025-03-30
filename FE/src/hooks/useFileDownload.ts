import { useState, useCallback } from 'react';
import axios from 'axios';

// FontFile 타입은 useFontRequests에서 가져와서 사용
export interface FontFile {
  presignedUrl: string;
  fileName: string;
}

export const useFileDownload = (file: FontFile) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const extractFileName = useCallback((fullPath: string): string => {
    const parts = fullPath.split('/');
    return parts[parts.length - 1]; 
  }, []);

  const actualFileName = extractFileName(file.fileName);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // axios를 사용한 파일 다운로드
      const response = await axios.get(file.presignedUrl, {
        responseType: 'blob',
      });

      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = actualFileName; // 추출된 실제 파일명 사용
      document.body.appendChild(a);
      a.click();

      // 메모리 정리
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      alert('파일 다운로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  }, [file, isDownloading, actualFileName]);

  return {
    isDownloading,
    actualFileName,
    handleDownload
  };
};

export default useFileDownload;