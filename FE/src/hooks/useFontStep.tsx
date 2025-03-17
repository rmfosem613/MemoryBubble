import { useState } from 'react';

export type Step = {
  id: number;
  title: string;
  description: string;
};

export const FONT_STEP: Step[] = [
  { id: 1, title: '준비하기', description: '준비물과 진행단계를 설명드려요' },
  {
    id: 2,
    title: '나의 손글씨 업로드',
    description: '본인의 폰트를 업로드해요',
  },
  { id: 3, title: '폰트 정보 입력', description: '폰트의 이름을 정해요' },
];

export function useFontStep(initialStep: number = 1) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const totalSteps = FONT_STEP.length;

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  return {
    steps: FONT_STEP,
    currentStep,
    totalSteps,
    handleStepClick,
    handlePreviousStep,
    handleNextStep,
  };
}
