import FontExplain from '@/components/fontPage/FontExplain';
import FontMain from '@/components/fontPage/FontMain';
import ProgressBar from '@/components/fontPage/ProgressBar';
import FontDownload from '@/components/fontPage/FontDownload';
import { useFontStep } from '@/hooks/useFontStep';
import React, { useEffect, useState } from 'react';
import useFontStore from '@/stores/useFontStore';

import apiClient from '@/apis/apiClient';

function FontPage() {
  const { steps, currentStep, handlePreviousStep, handleNextStep } =
    useFontStep();

  const { clearFiles, setFontNameKo } = useFontStore();

  // fontId 상태 추가
  const [fontId, setFontId] = useState<string | null>(null);
  // 로딩 상태 추가 (필요시)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 페이지가 마운트될 때 스토어 초기화
    clearFiles();
    setFontNameKo('');
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/api/fonts');
        console.log('폰트 ID:', response.data.fontId);

        // fontId 상태 업데이트
        setFontId(response.data.fontId);
      } catch (error) {
        console.error('폰트 정보 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFonts();
  }, []);

  // 로딩 중일 때 표시할 컴포넌트 (선택사항)
  if (isLoading) {
    return (
      <div className="container pt-[65px] h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">폰트 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // fontId가 있으면 FontDownload 컴포넌트 표시
  if (fontId) {
    return <FontDownload fontId={fontId} />;
  }

  // fontId가 없으면 기존 컴포넌트들 표시
  return (
    <div className="container pt-[65px] h-screen">
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="flex pt-2 gap-2 h-[calc(100%-130px)]">
        <div className="w-1/4">
          <FontExplain
            currentStep={currentStep}
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
          />
        </div>
        <div className="w-3/4">
          <FontMain currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
}

export default FontPage;
