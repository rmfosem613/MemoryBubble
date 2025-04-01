// src/hooks/useFontRequests.ts

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/apis/apiClient';

// 타입 정의
export interface FontFile {
  presignedUrl: string;
  fileName: string;
}

export interface FontRequest {
  fontId: number;
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
        console.log(error.response.data.message);
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
    async (fontId: number) => {
      try {
        // API 호출 - 실제 API가 있다면 구현
        // await apiClient.put(`/api/admin/fonts/${fontId}/complete`);

        // 목록에서 제거
        setFontRequests((prev) =>
          prev.filter((request) => request.fontId !== fontId),
        );
        if (selectedRequest?.fontId === fontId) {
          setSelectedRequest(null);
        }
      } catch (error) {
        console.error('Failed to complete font request:', error);
        alert('의뢰 완료 처리에 실패했습니다.');
      }
    },
    [selectedRequest],
  );

  // 의뢰 취소 핸들러 - fontId 파라미터를 받을 수 있도록 수정
  const handleCancel = useCallback(
    async (fontId?: number) => {
      // fontId가 전달되면 사용하고, 아니면 selectedRequest에서 가져옴
      const targetFontId = fontId || selectedRequest?.fontId;

      if (!targetFontId) return;

      try {
        await apiClient.delete(`/api/admin/fonts/${targetFontId}`);

        // 목록에서 제거
        setFontRequests((prev) =>
          prev.filter((request) => request.fontId !== targetFontId),
        );

        // 현재 선택된 요청이 삭제된 경우 null로 설정
        if (selectedRequest?.fontId === targetFontId) {
          setSelectedRequest(null);
        }

        alert('의뢰가 취소되었습니다.');
      } catch (error) {
        console.error('Failed to cancel font request:', error);
        alert('의뢰 취소에 실패했습니다.');
      }
    },
    [selectedRequest],
  );

  return {
    fontRequests,
    selectedRequest,
    handleSelectRequest,
    handleCompleteRequest,
    handleCancel,
  };
};

export default useFontRequests;
