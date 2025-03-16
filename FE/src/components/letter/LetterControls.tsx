import Button from "@/components/common/Button/Button";
import { useLetterInput } from '@/hooks/useLetterInput';

function LetterControls () {
  const { goToPreviousPage, goToNextPage } = useLetterInput();

  return (
    <div className="border-2 border-gray-300 rounded-[8px] h-full mb-1">
      <div className="flex space-x-2 pl-3 pr-3 justify-center">
        <div onClick={goToPreviousPage}>
          <Button icon="left" color="white" />
        </div>
        <div onClick={goToNextPage}>
          <Button icon="right" color="white" />
        </div>
      </div>
    </div>
  );
};

export default LetterControls;