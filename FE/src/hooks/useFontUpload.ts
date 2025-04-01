import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/apis/apiClient';
import axios from 'axios';

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

export const useFontUpload = (selectedRequest: FontRequest | null) => {
  const [ttfFile, setTtfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // 파일 선택 초기화 (의뢰가 변경될 때)
  useEffect(() => {
    setTtfFile(null);
    setUploadSuccess(false);
  }, [selectedRequest]);

  // TTF 파일 선택 핸들러
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.name.endsWith('.ttf')) {
          setTtfFile(file);
        } else {
          alert('TTF 파일만 업로드할 수 있습니다.');
        }
      }
    },
    [],
  );

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.ttf')) {
        setTtfFile(file);
      } else {
        alert('TTF 파일만 업로드할 수 있습니다.');
      }
    }
  }, []);

  // TTF 파일 업로드 핸들러
  const handleUpload = useCallback(async () => {
    if (!selectedRequest || !ttfFile) return;

    setIsUploading(true);
    try {
      // 1. 서버에 fontId를 보내 presignedUrl 요청
      const response = await apiClient.post('/api/admin/fonts', {
        fontId: selectedRequest.fontId,
      });

      const { presignedUrl } = response.data;

      // 2. presignedUrl을 사용하여 S3에 파일 직접 업로드
      await axios.put(presignedUrl, ttfFile, {
        headers: {
          'Content-Type': 'font/ttf',
        },
      });

      // 3. 성공 시 의뢰 완료 처리
      setUploadSuccess(true);
    } catch (error) {
      console.error('Font upload failed:', error);
      alert('폰트 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  }, [selectedRequest, ttfFile]);


  return {
    ttfFile,
    isUploading,
    uploadSuccess,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleUpload,
  };
};

export default useFontUpload;
