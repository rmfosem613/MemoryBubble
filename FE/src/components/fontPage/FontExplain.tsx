import React from 'react';
import Button from '../common/Button/Button';
import { getStepContent } from './FontStepContent';

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
          <Button name="다음" color="blue" onClick={onNextStep} />
        </div>
      )}
    </div>
  );
}

export default FontExplain;
