import FontExplain from '@/components/fontPage/FontExplain';
import FontMain from '@/components/fontPage/FontMain';
import ProgressBar from '@/components/fontPage/ProgressBar';
import { useFontStep } from '@/hooks/useFontStep';
import React from 'react';

function FontPage() {
  const {
    steps,
    currentStep,
    handleStepClick,
    handlePreviousStep,
    handleNextStep,
  } = useFontStep();

  return (
    <div className="container pt-[65px] h-screen">
      <ProgressBar
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
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
