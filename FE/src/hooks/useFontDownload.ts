import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/apis/apiClient';
import axios from 'axios';

interface FontResponse {
  fontId: string | null;
  fontName: string | null;
  createdAt: string | null;
  presignedUrl: string | null;
  fileName: string | null;
  status: string | null;
}

interface AlertState {
  visible: boolean;
  message: string;
  color: 'red' | 'green' | 'gray' | 'blue';
}

interface UseFontDownloadReturn {
  downloadFont: () => Promise<void>;
  resetFont: (fontId: string) => Promise<void>;
  loadFont: () => Promise<void>;
  fontLoaded: boolean;
  fontFamily: string | null;
  fontName: string | null;
  alertState: AlertState | null;
  showAlert: (message: string, color: 'red' | 'green' | 'gray' | 'blue') => void;
}

export const useFontDownload = (): UseFontDownloadReturn => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontName, setFontName] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  // Alert 표시 함수
  const showAlert = (message: string, color: 'red' | 'green' | 'gray' | 'blue') => {
    setAlertState({ visible: true, message, color });

    // 3초 후에 알림 숨기기
    setTimeout(() => {
      setAlertState(null);
    }, 3000);
  };

  // 폰트 정보 가져오는 함수
  const getFontInfo = async (): Promise<FontResponse> => {
    const response = await apiClient.get<FontResponse>('api/fonts');
    return response.data;
  };

  // 폰트 다운로드 함수
  const downloadFont = async () => {
    try {
      // 폰트 정보 가져오기
      const fontInfo = await getFontInfo();
      console.log('폰트 정보:', fontInfo);

      // presignedUrl이 있는지 확인
      if (fontInfo.presignedUrl) {
        // presignedUrl로 파일 다운로드
        const downloadResponse = await axios({
          url: fontInfo.presignedUrl,
          method: 'GET',
          responseType: 'blob',
        });

        // Blob 객체 생성 및 다운로드 링크 생성
        const blob = new Blob([downloadResponse.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        // 파일명 설정
        const fileName = fontInfo.fileName
          ? fontInfo.fileName.split('/').pop() // 경로에서 파일명만 추출
          : `font-${fontInfo.fontName || 'download'}.ttf`; // 기본 파일명

        link.setAttribute('download', fileName);

        // 링크 클릭 이벤트 발생시켜 다운로드 시작
        document.body.appendChild(link);
        link.click();

        // 임시 요소 및 URL 정리
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        console.log('폰트 다운로드 완료');
        showAlert('폰트 다운로드가 완료되었습니다.', 'green');
      } else {
        console.error('다운로드할 presignedUrl이 없습니다.');
        showAlert('다운로드할 폰트 정보가 없습니다.', 'red');
      }
    } catch (error) {
      console.error('폰트 다운로드 중 오류 발생:', error);
      showAlert('폰트 다운로드 중 오류가 발생했습니다.', 'red');
    }
  };

  // 폰트 로드 함수 (웹 폰트로 로드)
  const loadFont = async () => {
    try {
      // 이미 로드된 경우 중복 로드 방지
      if (fontLoaded) return;

      // 폰트 정보 가져오기
      const fontInfo = await getFontInfo();
      console.log('폰트 정보 (로드용):', fontInfo);

      // 폰트 상태 확인
      if (fontInfo.status !== 'DONE') {
        showAlert(
          '폰트 생성 중입니다! 폰트 생성에는 약 3시간 정도 소요됩니다.',
          'green',
        );
        return;
      }

      const createName = fontInfo.fontName;

      // presignedUrl이 없는 경우 (폰트가 아직 없음)
      if (!fontInfo.presignedUrl || !fontInfo.fontName) {
        console.log('폰트가 아직 생성되지 않았습니다.');
        setFontFamily('pretendard'); // 기본 폰트 사용
        setFontLoaded(false); // 로드 상태는 false 유지
        return;
      }

      // 고유한 폰트 패밀리 이름 생성 (fontId를 포함하여 중복 방지)
      const fontFamilyName = `custom-font-${fontInfo.fontId}-${fontInfo.fontName}`;

      // 이미 해당 폰트가 로드되었는지 확인
      const existingStyle = document.getElementById(
        `font-style-${fontInfo.fontId}`,
      );
      if (existingStyle) {
        console.log('이미 로드된 폰트입니다.');
        setFontFamily(fontFamilyName);
        setFontName(createName);
        setFontLoaded(true);
        showAlert('폰트가 성공적으로 로드되었습니다.', 'green');
        return;
      }

      // @font-face 규칙 생성
      const style = document.createElement('style');
      style.id = `font-style-${fontInfo.fontId}`;
      style.textContent = `
        @font-face {
          font-family: '${fontFamilyName}';
          src: url('${fontInfo.presignedUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `;

      // head에 스타일 추가
      document.head.appendChild(style);

      // 폰트 로드 상태 추적
      const font = new FontFace(
        fontFamilyName,
        `url(${fontInfo.presignedUrl})`,
      );

      try {
        // 폰트 로드 완료 대기
        await font.load();
        document.fonts.add(font);
        console.log('폰트 로드 완료:', fontFamilyName);

        // 상태 업데이트
        setFontFamily(fontFamilyName);
        setFontName(createName);
        setFontLoaded(true);
        showAlert('폰트가 성공적으로 로드되었습니다.', 'green');
      } catch (error) {
        console.error('폰트 로드 실패:', error);
        showAlert('폰트가 만들어지기 전 입니다! 조금만 기다려 주세요!', 'red');
        style.remove(); // 실패 시 스타일 제거
      }
    } catch (error) {
      console.error('폰트 로드 중 오류 발생:', error);
      setFontFamily('pretendard'); // 오류 발생 시 기본 폰트 사용
      setFontLoaded(false);
      showAlert('폰트 로드 중 오류가 발생했습니다.', 'red');
    }
  };

  // 폰트 삭제 함수 - 이제 이 함수는 모달을 표시하는 용도로만 사용
  // 실제 삭제 로직은 FontDeleteModal 컴포넌트에서 처리
  const resetFont = useCallback(async (fontId: string) => {
    try {
      // 이 함수는 이제 직접적인 삭제를 수행하지 않음
      // 호환성을 위해 유지하지만 실제 처리는 FontDeleteModal에서 함
      return Promise.resolve();
    } catch (error) {
      console.error('폰트 삭제 중 오류 발생:', error);
      showAlert('폰트 삭제 중 오류가 발생했습니다.', 'red');
      return Promise.reject(error);
    }
  }, []);

  // 컴포넌트 마운트 시 자동으로 폰트 로드
  useEffect(() => {
    loadFont();
  }, []);

  return {
    downloadFont,
    resetFont,
    loadFont,
    fontLoaded,
    fontFamily,
    fontName,
    alertState,
    showAlert, // 외부에서 알림을 표시할 수 있도록 함수 노출
  };
};

export default useFontDownload;
