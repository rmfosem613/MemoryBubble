import { create } from 'zustand';
import apiClient from '@/apis/apiClient';
import axios from 'axios';

// FileItem 인터페이스 정의
interface FileItem {
  id: string;
  name: string;
  file: File;
}

// presignedUrl 응답 인터페이스
interface PresignedUrlData {
  presignedUrl: string;
  fileName: string;
}

// 폰트 스토어 상태 인터페이스
interface FontState {
  // 파일 관련 상태
  uploadedFiles: FileItem[];
  addFiles: (files: FileItem[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;

  // 폰트명 관련 상태
  fontNameKo: string;
  setFontNameKo: (name: string) => void;

  // 제출 관련 함수와 상태
  submitFont: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;

  // 폰트 삭제 함수
}

// Zustand 스토어 생성
const useFontStore = create<FontState>((set, get) => ({
  // 파일 관련 상태 및 액션
  uploadedFiles: [],
  addFiles: (files) =>
    set((state) => ({
      uploadedFiles: [...state.uploadedFiles, ...files],
    })),
  removeFile: (id) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
    })),
  clearFiles: () => set({ uploadedFiles: [] }),

  // 폰트명 관련 상태 및 액션
  fontNameKo: '',

  setFontNameKo: (name) => set({ fontNameKo: name }),

  // 제출 관련 상태 및 액션
  isSubmitting: false,
  submitError: null,
  submitFont: async () => {
    const { uploadedFiles, fontNameKo } = get();

    // 유효성 검사
    if (uploadedFiles.length === 0) {
      set({ submitError: '업로드된 파일이 없습니다.' });
      return;
    }

    if (!fontNameKo.trim()) {
      set({ submitError: '폰트명을 모두 입력해주세요.' });
      return;
    }

    try {
      set({ isSubmitting: true, submitError: null });

      // 1단계: 폰트 이름 정보만 포함하는 요청 보내기
      const fontData = {
        fontName: fontNameKo,
      };

      // 첫 번째 API 요청 (폰트 정보 제출)
      const fontResponse = await apiClient.post('/api/fonts', fontData);
      console.log('폰트 정보 제출 성공:', fontResponse.data);

      // presignedUrl 배열 확인
      if (
        fontResponse.data &&
        Array.isArray(fontResponse.data) &&
        fontResponse.data.length > 0
      ) {
        console.log('presignedUrl 배열을 통해 파일 업로드 시작');

        // 업로드할 파일 수 (presignedUrl 배열 길이와 실제 파일 수 중 작은 값)
        const uploadCount = Math.min(
          fontResponse.data.length,
          uploadedFiles.length,
        );

        // 파일 업로드 작업 배열
        const uploadPromises = [];

        // 각 파일을 해당 presignedUrl에 업로드
        for (let i = 0; i < uploadCount; i++) {
          const fileItem = uploadedFiles[i];
          const urlData = fontResponse.data[i] as PresignedUrlData;

          if (fileItem && urlData && urlData.presignedUrl) {
            // 각 파일을 해당 presignedUrl로 업로드 (axios 사용)
            const uploadPromise = (async () => {
              try {
                console.log(
                  `파일 "${fileItem.name}"을 "${urlData.fileName}"으로 업로드 시작`,
                );

                const uploadResponse = await axios({
                  url: urlData.presignedUrl,
                  method: 'PUT',
                  data: fileItem.file,
                  headers: {
                    'Content-Type': fileItem.file.type,
                  },
                });

                console.log(
                  `파일 "${fileItem.name}"을 "${urlData.fileName}"으로 업로드 성공`,
                );
                return true;
              } catch (error) {
                console.error(`파일 "${fileItem.name}" 업로드 실패:`, error);
                return false;
              }
            })();

            uploadPromises.push(uploadPromise);
          }
        }

        // 모든 업로드 작업이 완료될 때까지 대기
        const uploadResults = await Promise.all(uploadPromises);

        // 모든 파일이 성공적으로 업로드되었는지 확인
        const allUploadsSuccessful = uploadResults.every(
          (result) => result === true,
        );

        if (allUploadsSuccessful) {
          console.log('모든 파일 업로드 완료');
          window.location.reload();
        } else {
          console.warn('일부 파일 업로드 실패');
          set({ submitError: '일부 파일 업로드에 실패했습니다.' });
        }
      } else {
        console.error('presignedUrl 배열이 응답에 포함되어 있지 않습니다');
        set({ submitError: 'presignedUrl을 받지 못했습니다.' });
      }

      // 성공 후 상태 초기화
      set({
        uploadedFiles: [],
        fontNameKo: '',

        isSubmitting: false,
        submitError: null, // 성공 시 에러 메시지 초기화
      });
    } catch (error) {
      console.error('폰트 제출 실패:', error);
      set({
        submitError: '폰트 제출 중 오류가 발생했습니다.',
        isSubmitting: false,
      });
    }
  },
}));

export default useFontStore;
