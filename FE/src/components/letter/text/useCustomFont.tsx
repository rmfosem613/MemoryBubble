import { useEffect, useState } from 'react';
import apiClient from '@/apis/apiClient';

interface FontResponse {
  fontId: string | null;
  fontName: string | null;
  createdAt: string | null;
  presignedUrl: string | null;
  fileName: string | null;
  status: string | null;
}

export const useCustomFont = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontName, setFontName] = useState<string | null>(null);

  // 폰트 정보 가져오는 함수
  const getFontInfo = async (): Promise<FontResponse> => {
    const response = await apiClient.get<FontResponse>('api/fonts');
    return response.data;
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
        console.log('폰트 생성 중입니다.');
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
      } catch (error) {
        console.error('폰트 로드 실패:', error);
        style.remove(); // 실패 시 스타일 제거
      }
    } catch (error) {
      console.error('폰트 로드 중 오류 발생:', error);
      setFontFamily('pretendard'); // 오류 발생 시 기본 폰트 사용
      setFontLoaded(false);
    }
  };

  // 컴포넌트 마운트 시 자동으로 폰트 로드
  useEffect(() => {
    loadFont();
  }, []);

  return {
    loadFont,
    fontLoaded,
    fontFamily,
    fontName,
  };
};

export default useCustomFont;
