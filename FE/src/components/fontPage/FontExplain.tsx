import React from 'react';
import Button from '../common/Button/Button';
import { getStepContent } from './FontStepContent';
import useFontStore from '@/stores/useFontStore'; // Zustand 스토어 import

interface FontExplainProps {
  currentStep: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

function FontExplain({
  currentStep,
  onPreviousStep,
  onNextStep,
}: FontExplainProps) {
  const { title, content } = getStepContent(currentStep);
  const { uploadedFiles } = useFontStore(); // 스토어에서 파일 목록 가져오기

  // 파일이 8개인지 확인
  const isFilesComplete = uploadedFiles.length === 8;

  // 단계 2에서 파일 상태에 따라 다음 버튼 클릭 처리
  const handleNextClick = () => {
    // 단계 2이고 파일이 8개가 아니면 함수 실행하지 않음
    if (currentStep === 2 && !isFilesComplete) {
      return;
    }
    onNextStep();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border border-gray-400 rounded-lg p-4 flex-grow overflow-y-auto">
        <h3 className="font-p-700 text-lg mb-2">{title}</h3>
        <div className="font-p-400 text-subtitle-2-lg whitespace-pre-line">
          {content}
        </div>
      </div>
      {currentStep === 1 ? (
        <div className="mt-2">
          <Button name="다음" color="blue" onClick={onNextStep} />
        </div>
      ) : currentStep === 3 ? (
        <div className="mt-2">
          <Button name="이전" color="white" onClick={onPreviousStep} />
        </div>
      ) : (
        <div className="flex justify-between mt-2 gap-2">
          <Button name="이전" color="white" onClick={onPreviousStep} />
          <Button
            name="다음"
            color={currentStep === 2 && !isFilesComplete ? 'gray' : 'blue'}
            onClick={handleNextClick}
          />
        </div>
      )}
    </div>
  );
}

export default FontExplain;
