import apiClient from './apiClient';

export interface SendLetterRequest {
  type: "AUDIO" | "TEXT";
  content: string;
  openAt: string; // 2025-01-01 형식
  backgroundColor: string;
  receiverId: number;
}

export const sendLetter = async (letterData: SendLetterRequest): Promise<boolean> => {
  try {
    const response = await apiClient.post("/api/letters", letterData);
    console.log("편지 보내기 성공:", response.data);
    return true;
  } catch (error) {
    console.error("편지 보내기 실패:", error);
    throw error;
  }
};
