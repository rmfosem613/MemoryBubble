// src/hooks/useFontRequests.ts

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/apis/apiClient';

// 타입 정의
export interface FontFile {
  presignedUrl: string;
  fileName: string;
}

export interface FontRequest {
  userId: number;
  userName: string;
  fontName: string;
  files: FontFile[];
}

export const useFontRequests = () => {
  const [fontRequests, setFontRequests] = useState<FontRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FontRequest | null>(
    null,
  );

  // 폰트 의뢰 목록 불러오기
  useEffect(() => {
    const fetchFontRequests = async () => {
      try {
        const response = await apiClient.get('/api/admin/fonts');
        setFontRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch font requests:', error);
        // 에러 발생 시 빈 배열 설정
        setFontRequests([]);
      }
    };

    fetchFontRequests();
  }, []);

  // 의뢰 선택 핸들러
  const handleSelectRequest = useCallback((request: FontRequest) => {
    setSelectedRequest(request);
  }, []);

  // 의뢰 완료 핸들러
  const handleCompleteRequest = useCallback(
    async (userId: number) => {
      try {
        // API 호출 - 실제 API가 있다면 구현
        // await apiClient.put(`/api/admin/fonts/${userId}/complete`);

        // 목록에서 제거
        setFontRequests((prev) =>
          prev.filter((request) => request.userId !== userId),
        );
        if (selectedRequest?.userId === userId) {
          setSelectedRequest(null);
        }
      } catch (error) {
        console.error('Failed to complete font request:', error);
        alert('의뢰 완료 처리에 실패했습니다.');
      }
    },
    [selectedRequest],
  );

  return {
    fontRequests,
    selectedRequest,
    handleSelectRequest,
    handleCompleteRequest,
  };
};

export default useFontRequests;
