// src/hooks/useFontRequests.ts

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/apis/apiClient';
import axios from 'axios';

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
  createdAt: string; // 생성날짜 추가
}

export interface AlertState {
  visible: boolean;
  message: string;
  color: 'red' | 'green' | 'gray' | 'blue';
}

export const useFontRequests = (getCurrentFile?: () => File | null) => {
  const [fontRequests, setFontRequests] = useState<FontRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FontRequest | null>(
    null,
  );
  const [alertRequestState, setAlertRequestState] = useState<AlertState | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Alert 표시 함수
  const showAlert = useCallback(
    (message: string, color: 'red' | 'green' | 'gray' | 'blue') => {
      setAlertRequestState({ visible: true, message, color });

      // 3초 후에 알림 숨기기
      setTimeout(() => {
        setAlertRequestState(null);
      }, 3000);
    },
    [],
  );

  // 폰트 의뢰 목록 불러오기
  useEffect(() => {
    const fetchFontRequests = async () => {
      try {
        const response = await apiClient.get('/api/admin/fonts');
        console.log('폰트 의뢰 목록:', response.data);

        setFontRequests(response.data);

        if (response.data.length > 0) {
          showAlert('폰트 의뢰 목록을 불러왔습니다.', 'green');
        } else {
          showAlert('처리할 폰트 의뢰가 없습니다.', 'gray');
        }
      } catch (error) {
        console.log(
          error.response?.data?.message ||
            '폰트 의뢰 목록을 불러오는데 실패했습니다.',
        );
        showAlert('폰트 의뢰 목록을 불러오는데 실패했습니다.', 'red');
        // 에러 발생 시 빈 배열 설정
        setFontRequests([]);
      }
    };

    fetchFontRequests();
  }, [showAlert]);

  // 의뢰 선택 핸들러
  const handleSelectRequest = useCallback((request: FontRequest) => {
    setSelectedRequest(request);
  }, []);

  // 의뢰 완료 핸들러 - 파일 업로드 기능 포함
  const handleCompleteRequest = useCallback(
    async (fontId: number) => {
      setIsProcessing(true);
      try {
        // 현재 선택된 파일 가져오기
        const ttfFile = getCurrentFile ? getCurrentFile() : null;

        // 파일이 선택되어 있으면 업로드 진행
        if (ttfFile) {
          try {
            // 1. 서버에 fontId를 보내 presignedUrl 요청
            const response = await apiClient.patch(
              `/api/admin/fonts/${fontId}`,
            );

            const { presignedUrl } = response.data;

            // 2. presignedUrl을 사용하여 S3에 파일 직접 업로드
            await axios.put(presignedUrl, ttfFile, {
              headers: {
                'Content-Type': 'font/ttf',
              },
            });

            showAlert('폰트 파일이 성공적으로 업로드되었습니다.', 'green');
          } catch (error) {
            console.error('Font upload failed:', error);
            showAlert('폰트 파일 업로드에 실패했습니다.', 'red');
            setIsProcessing(false);
            return; // 업로드 실패 시 의뢰 완료 처리하지 않음
          }
        } else {
          // 파일이 없는 경우의 처리
          showAlert('업로드할 TTF 파일이 선택되지 않았습니다.', 'red');
          setIsProcessing(false);
          return;
        }

        // 목록에서 제거
        setFontRequests((prev) =>
          prev.filter((request) => request.fontId !== fontId),
        );

        // 선택된 의뢰가 완료되었다면 선택 해제
        if (selectedRequest?.fontId === fontId) {
          setSelectedRequest(null);
        }

        showAlert('의뢰가 성공적으로 완료되었습니다.', 'green');
      } catch (error) {
        console.error('Failed to complete font request:', error);
        showAlert('의뢰 완료 처리에 실패했습니다.', 'red');
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedRequest, showAlert, getCurrentFile],
  );

  // 의뢰 취소 핸들러 - fontId 파라미터를 받을 수 있도록 수정
  const handleCancel = useCallback(
    async (fontId?: number) => {
      // fontId가 전달되면 사용하고, 아니면 selectedRequest에서 가져옴
      const targetFontId = fontId || selectedRequest?.fontId;

      if (!targetFontId) {
        showAlert('취소할 의뢰가 선택되지 않았습니다.', 'red');
        return;
      }

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

        showAlert('의뢰가 취소되었습니다.', 'green');
      } catch (error) {
        console.error('Failed to cancel font request:', error);
        showAlert('의뢰 취소에 실패했습니다.', 'red');
      }
    },
    [selectedRequest, showAlert],
  );

  return {
    fontRequests,
    selectedRequest,
    alertRequestState,
    isProcessing,
    handleSelectRequest,
    handleCompleteRequest,
    handleCancel,
  };
};

export default useFontRequests;
