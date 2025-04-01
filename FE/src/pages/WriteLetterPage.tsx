import { useState } from 'react';
import Title from '@/components/common/Title';
import LetterTypeSelector from '@/components/letter/common/LetterTypeSelector';
import TextLetterContent from '@/components/letter/text/TextLetterContent';
import CassetteContent from '@/components/letter/cassette/CassetteContent';
import LetterControls from '@/components/letter/common/LetterControls';
import Button from '@/components/common/Button/Button';
import { useLetterStore } from '@/stores/useLetterStore';
import { sendLetter } from '@/apis/letterApi';
import { SendLetterRequest } from '@/apis/letterApi';
import { useNavigate } from 'react-router-dom';

function WriteLetterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  // 편지 타입 및 상태 정보 가져오기
  const { 
    letterType, 
    selectedColor, 
    selectedMember, 
    cassetteData 
  } = useLetterStore();

  // 편지 보내기 처리 함수
  const handleSendLetter = async () => {
    // 유효성 검사
    if (!selectedMember) {
      alert('받는 사람을 선택해주세요.');
      return;
    }

    const themeColor = selectedColor || 'winter';

    // 텍스트 편지인 경우 내용 확인
    if (letterType === 'TEXT' && !textContent.trim()) {
      alert('편지 내용을 입력해주세요.');
      return;
    }

    // 카세트 편지인 경우 녹음 확인
    if (letterType === 'AUDIO' && !cassetteData.isRecorded) {
      alert('녹음을 완료해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      // 날짜 포맷팅 (YYYY-MM-DD)
      const formattedDate = selectedDate 
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : new Date().toISOString().split('T')[0];
      
      // API 요청 데이터 구성
      const letterRequest: SendLetterRequest = {
        type: letterType,
        content: letterType === 'TEXT' ? textContent : cassetteData.recordingUrl || '',
        openAt: formattedDate,
        backgroundColor: themeColor,
        receiverId: parseInt(selectedMember.id, 10)
      };

      const success = await sendLetter(letterRequest);
      
      if (success) {
        alert('편지가 성공적으로 전송되었습니다.');
        navigate('/letter-box'); // 편지함 페이지로 이동
      }
    } catch (error) {
      console.error('편지 전송 오류:', error);
      alert('편지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-[8px]">
        <div className="relative mb-[20px]">
          <Title text="편지쓰기" />
          <p className="flex absolute top-[108px] left-[160px]">나만의 손글씨를 사용하여 편지로 마음을 전해보세요</p>
        </div>
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
                {letterType === 'TEXT' ? 
                  <TextLetterContent onContentChange={setTextContent} content={textContent} /> : 
                  <CassetteContent />
                }
              </div>
            </div>
          </div>

          {/* grid 3 */}
          <div className="col-span-3">
            <div className="flex-row h-[85%]">
              <LetterControls onDateChange={setSelectedDate} />
              <Button 
                icon="send" 
                name={isLoading ? "전송 중..." : "편지보내기"} 
                color="blue" 
                onClick={handleSendLetter}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WriteLetterPage;