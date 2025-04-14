import apiClient from './apiClient';

export interface SendLetterRequest {
  type: 'AUDIO' | 'TEXT';
  content: string;
  openAt: string; // 2025-01-01 형식
  backgroundColor: string;
  receiverId: number;
  duration: number; 
}

// 편지 보내기 응답 타입 정의 (AUDIO 타입일 경우 presignedUrl 포함)
export interface SendLetterResponse {
  presignedUrl?: string;
  fileName?: string;
}

export const sendLetter = async (
  letterData: SendLetterRequest,
): Promise<SendLetterResponse> => {
  try {
    const response = await apiClient.post<SendLetterResponse>(
      '/api/letters',
      letterData,
    );
    console.log('편지 보내기 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('편지 보내기 실패:', error);
    throw error;
  }
};
