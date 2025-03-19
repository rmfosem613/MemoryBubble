import Button from '@/components/common/Button/Button';
import React from 'react';

interface FontActionsProps {
  onDownload: () => void;
  onReset: () => void;
}

const FontActions: React.FC<FontActionsProps> = ({ onDownload, onReset }) => {
  return (
    <div className="flex flex-col gap-2 px-[350px] container">
      <Button name="글꼴 다운로드" color="blue" onClick={onDownload} />
      <Button name="다시만들기" color="white" onClick={onReset} />
    </div>
  );
};

export default FontActions;
