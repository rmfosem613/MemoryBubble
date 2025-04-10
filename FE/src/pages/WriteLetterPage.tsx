import { useState, useEffect } from 'react';
import Title from '@/components/common/Title';
import LetterTypeSelector from '@/components/letter/common/LetterTypeSelector';
import TextLetterContent from '@/components/letter/text/TextLetterContent';
import CassetteContent from '@/components/letter/cassette/CassetteContent';
import LetterControls from '@/components/letter/common/LetterControls';
import Button from '@/components/common/Button/Button';
import { useLetterStore } from '@/stores/useLetterStore';
import { sendLetter } from '@/apis/letterApi';
import { SendLetterRequest } from '@/apis/letterApi';
import { useUserApi } from '@/apis/useUserApi';

import Alert from '@/components/common/Alert';

function WriteLetterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { uploadImageWithPresignedUrl } = useUserApi();

  // 편지 타입 및 상태 정보 가져오기
  const {
    letterType,
    selectedColor,
    selectedMember,
    cassetteData,
    textContent,
    setTextContent,
    resetLetterState,
  } = useLetterStore();

  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('red');

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = 'red') => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  useEffect(() => {
    setTextContent('');
  }, [setTextContent]);

  // 오디오 파일을 Blob으로 변환하는 함수
  const fetchAudioBlobFromUrl = async (audioUrl: string): Promise<Blob> => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('오디오 파일 변환 실패:', error);
      throw error;
    }
  };

  // 편지 내용 변경 핸들러
  const handleContentChange = (content: string) => {
    setTextContent(content);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // 편지 보내기 처리 함수
  const handleSendLetter = async () => {
    console.log('녹음 시간:', cassetteData.recordingDuration);
    // 유효성 검사
    if (!selectedMember) {
      showAlertMessage('받는 사람을 선택해주세요.', 'red');
      return;
    }

    // selectedColor가 없는 경우 기본값으로 winter 사용
    const themeColor = selectedColor || 'winter';

    // 텍스트 편지인 경우 내용 확인 (공백만 있는 경우도 체크)
    if (letterType === 'TEXT' && !textContent.trim()) {
      showAlertMessage('편지 내용을 입력해주세요.', 'red');
      return;
    }

    // 카세트 편지인 경우 녹음 확인
    if (letterType === 'AUDIO' && !cassetteData.isRecorded) {
      showAlertMessage('녹음을 완료해주세요.', 'red');
      return;
    }

    try {
      setIsLoading(true);

      // 날짜 포맷팅 (YYYY-MM-DD)
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

      // 텍스트 편지의 경우 줄바꿈을 <br/>로 변환
      const processedContent =
        letterType === 'TEXT' ? textContent.replace(/\n/g, '<br/>') : '';

      // API 요청 데이터 구성
      const letterRequest: SendLetterRequest = {
        type: letterType,
        content: processedContent, // 변환된 내용 또는 AUDIO 타입인 경우 빈 문자열
        openAt: formattedDate,
        backgroundColor: themeColor,
        receiverId: parseInt(selectedMember.id, 10),
        duration: cassetteData.recordingDuration || 300, // AUDIO 타입인 경우 녹음 시간
      };

      console.log(letterRequest, '편지 전송 요청 데이터');

      // 편지 전송 API 호출
      const response = await sendLetter(letterRequest);

      // AUDIO 타입인 경우, 녹음된 오디오 파일을 presignedUrl에 업로드
      if (
        letterType === 'AUDIO' &&
        cassetteData.recordingUrl &&
        response.presignedUrl
      ) {
        // 오디오 URL에서 Blob 객체 가져오기
        const audioBlob = await fetchAudioBlobFromUrl(
          cassetteData.recordingUrl
        );

        // 파일 타입 설정 (오디오 녹음은 일반적으로 audio/wav 또는 audio/webm)
        const audioFile = new File([audioBlob], 'recording.mp3', {
          type: 'audio/mpeg',
        });

        try {
          // presignedUrl로 오디오 파일 업로드
          await uploadImageWithPresignedUrl(response.presignedUrl, audioFile);
        } catch (uploadError) {
          console.error('오디오 파일 업로드 실패:', uploadError);
          showAlertMessage(
            '오디오 파일 업로드에 실패했습니다. 다시 시도해주세요.',
            'red'
          );
          throw uploadError;
        }
      }

      showAlertMessage('편지가 성공적으로 전송되었습니다.', 'green');
      
      // 성공 시 상태 초기화
      resetLetterState();
      
      // 날짜를 오늘 날짜로 초기화
      const today = new Date();
      setSelectedDate(today);
    } catch (error) {
      console.error('편지 전송 오류:', error);
      showAlertMessage('편지 전송에 실패했습니다. 다시 시도해주세요.', 'red');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}

      <div className="container mt-[8px]">
        <div className="relative mb-[20px]">
          <Title text="편지쓰기" />
          <p className="flex absolute top-[108px] left-[160px]">
            나만의 손글씨를 사용하여 편지로 마음을 전해보세요
          </p>
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
                {letterType === 'TEXT' ? (
                  <TextLetterContent
                    onContentChange={handleContentChange}
                    content={textContent}
                  />
                ) : (
                  <CassetteContent selectedDate={selectedDate} />
                )}
              </div>
            </div>
          </div>

          {/* grid 3 */}
          <div className="col-span-3">
            <div className="flex-row h-[85%]">
              <LetterControls 
                onDateChange={handleDateChange}
                selectedDate={selectedDate} // Pass the selected date to the LetterControls component
              />
              <Button
                icon="send"
                name={isLoading ? '전송 중...' : '편지보내기'}
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