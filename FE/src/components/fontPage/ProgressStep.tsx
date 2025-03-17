import React from 'react';
import { Step } from '@/hooks/useFontStep';

interface ProgressStepProps {
  step: Step;
  isActive: boolean;
  onClick?: () => void;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  step,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`relative flex-1 p-3 rounded-lg border-2 ${
        isActive
          ? 'bg-blue-50 border-blue-500 text-blue-700'
          : 'bg-white border-gray-300 text-gray-500'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}>
      <div className="flex items-center">
        <div
          className={`
          flex items-center justify-center w-8 h-8 rounded-full mr-3 
          ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
        `}>
          {step.id}
        </div>
        <div>
          <div className="text-subtitle-2-lg">{step.title}</div>
          <div className="text-subtitle-3-lg">{step.description}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStep;
