import { useState, useEffect, useCallback } from 'react';

// FontRequest 타입은 useFontRequests에서 가져와서 사용
export interface FontRequest {
  fontId: number;
  userName: string;
  fontName: string;
  files: FontFile[];
}

export interface FontFile {
  presignedUrl: string;
  fileName: string;
}

export interface AlertState {
  visible: boolean;
  message: string;
  color: 'red' | 'green' | 'gray';
}

export const useFontUpload = (selectedRequest: FontRequest | null) => {
  const [ttfFile, setTtfFile] = useState<File | null>(null);
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  // Alert 표시 함수
  const showAlert = useCallback(
    (message: string, color: 'red' | 'green' | 'gray') => {
      setAlertState({ visible: true, message, color });

      // 3초 후에 알림 숨기기
      setTimeout(() => {
        setAlertState(null);
      }, 3000);
    },
    [],
  );

  // 파일 선택 초기화 (의뢰가 변경될 때)
  useEffect(() => {
    setTtfFile(null);
  }, [selectedRequest]);

  // TTF 파일 선택 핸들러
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.name.endsWith('.ttf')) {
          setTtfFile(file);
          showAlert('TTF 파일이 선택되었습니다.', 'green');
        } else {
          showAlert('TTF 파일만 업로드할 수 있습니다.', 'red');
        }
      }
    },
    [showAlert],
  );

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.ttf')) {
          setTtfFile(file);
          showAlert('TTF 파일이 선택되었습니다.', 'green');
        } else {
          showAlert('TTF 파일만 업로드할 수 있습니다.', 'red');
        }
      }
    },
    [showAlert],
  );

  // 현재 선택된 파일을 반환하는 함수
  const getCurrentFile = useCallback(() => ttfFile, [ttfFile]);

  return {
    ttfFile,
    alertState,
    handleFileChange,
    handleDragOver,
    handleDrop,
    getCurrentFile,
  };
};

export default useFontUpload;
