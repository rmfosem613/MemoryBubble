import Title from "@/components/common/Title";
import LetterTypeSelector from '@/components/letter/LetterTypeSelector';
import LetterContent from '@/components/letter/LetterContent';
import CassetteContent from "@/components/letter/CassetteContent";
import LetterControls from '@/components/letter/LetterControls';
import { useLetterInput } from '@/hooks/useLetterInput';

import Button from "@/components/common/Button/Button";
import { useLetterStore } from "@/stores/useLetterStore";

function WriteLetterPage() {

  // 화면 클릭 감지
  const { handleClick } = useLetterInput();

  // 편지 타입 선택
  const { letterType } = useLetterStore();

  return (
    <>
      <Title text="편지쓰기" />
      <div className="container mt-[17px]" onClick={handleClick}>
        <div className="grid grid-cols-12 gap-1">

          {/* grid 9 */}
          <div className="col-span-9">
            <div className="grid grid-rows-11 gap-1">
              {/* 편지 타입 선택 레이아웃 */}
              <div className="row-span-1">
                <LetterTypeSelector />
              </div>
              {/* 편지 레이아웃 */}
              <div className="row-span-10">
                {/* <LetterContent /> */}
                {letterType === 'text' ? <LetterContent /> : <CassetteContent />}
              </div>
            </div>
          </div>

          {/* grid 3 */}
          <div className="col-span-3">
            <div className="flex-row h-[85%]">
              <LetterControls />
              <Button icon="send" name="편지보내기" color="blue" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WriteLetterPage;