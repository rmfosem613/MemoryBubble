import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/apis/apiClient';
import axios from 'axios';

interface FontResponse {
  fontId: string | null;
  fontName: string | null;
  createdAt: string | null;
  presignedUrl: string | null;
  fileName: string | null;
}

interface UseFontDownloadReturn {
  downloadFont: () => Promise<void>;
  resetFont: (fontId: string) => Promise<void>;
  loadFont: () => Promise<void>;
  fontLoaded: boolean;
  fontFamily: string | null;
  fontName: string | null; // fontName 추가
}

export const useFontDownload = (): UseFontDownloadReturn => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontName, setFontName] = useState<string | null>(null);

  // 폰트 정보 가져오는 함수
  const getFontInfo = async (): Promise<FontResponse> => {
    const response = await apiClient.get<FontResponse>('api/fonts');
    console.log('폰트 정보11111:', response.data);
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
      } else {
        console.error('다운로드할 presignedUrl이 없습니다.');
      }
    } catch (error) {
      console.error('폰트 다운로드 중 오류 발생:', error);
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
        setFontLoaded(true);
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
      } catch (loadError) {
        console.error('폰트 로드 실패:', loadError);
        alert('폰트가 만들어지지 전 입니다!\n 조금만 기다려 주세요!');
        style.remove(); // 실패 시 스타일 제거
      }
    } catch (error) {
      console.error('폰트 로드 중 오류 발생:', error);
      setFontFamily('pretendard'); // 오류 발생 시 기본 폰트 사용
      setFontLoaded(false);
    }
  };

  const resetFont = useCallback(async (fontId: string) => {
    try {
      const response = await apiClient.delete(`/api/fonts/${fontId}`);
      console.log('폰트 삭제 결과:', response);

      // 스타일 요소 제거
      const styleElement = document.getElementById(`font-style-${fontId}`);
      if (styleElement) {
        styleElement.remove();
      }

      // 성공 메시지나 추가 처리가 필요하면 여기에 구현
      console.log(`폰트 ID ${fontId} 삭제 완료`);

      // 상태 초기화
      setFontLoaded(false);
      setFontFamily(null);

      // 페이지 리로드
      window.location.reload();
    } catch (error) {
      console.error('폰트 삭제 중 오류 발생:', error);
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
  };
};

export default useFontDownload;
