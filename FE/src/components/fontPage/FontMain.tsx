import Step1 from './fontComponent/Step1';
import Step2 from './fontComponent/Step2';
import Step3 from './fontComponent/Step3';

interface FontMainProps {
  currentStep: number;
}

function FontMain({ currentStep }: FontMainProps) {
  return (
    <div className="border border-gray-400 rounded-lg h-full">
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
    </div>
  );
}

export default FontMain;
