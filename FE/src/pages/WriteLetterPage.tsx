import Title from '@/components/common/Title';
import LetterTypeSelector from '@/components/letter/common/LetterTypeSelector';
import TextLetterContent from '@/components/letter/text/TextLetterContent';
import CassetteContent from '@/components/letter/cassette/CassetteContent';
import LetterControls from '@/components/letter/common/LetterControls';
import Button from '@/components/common/Button/Button';
import { useLetterStore } from '@/stores/useLetterStore';

function WriteLetterPage() {
  // 편지 타입 선택
  const { letterType } = useLetterStore();

  return (
    <>
      <div className="container mt-[17px]">
        <Title text="편지쓰기" />
        <p className="absolute mt-[-27px] ml-[140px]">
          나만의 손글씨를 사용하여 편지로 마음을 전해보세요
        </p>

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
                {letterType === 'TEXT' ? (
                  <TextLetterContent />
                ) : (
                  <CassetteContent />
                )}
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
