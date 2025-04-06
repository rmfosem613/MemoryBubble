import { useState, useEffect } from 'react';
import WaveAnimation from './WaveAnimation';
import CassettePlayer from './CassettePlayer';
import CassetteImage from './CassetteImage';
import AnimationStyles from './AnimationStyles';
import LetterContainer from '../common/LetterContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '@/components/common/Alert';

interface CassetteContentProps {
  selectedDate?: Date | null;
}

function CassetteContent({ selectedDate }: CassetteContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red", onConfirm?: () => void, onCancel?: () => void) => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
    
    if (onConfirm || onCancel) {
      return { confirmButton: onConfirm, cancelButton: onCancel };
    }
    
    // 버튼이 없는 일반 알림인 경우 자동 숨김
    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };
  
  // 페이지 이동 감지를 위한 리스너 추가
  useEffect(() => {
    // 브라우저 기본 beforeunload 이벤트 핸들러 (브라우저 닫기 등에 대응)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue = '녹음 중입니다. 페이지를 벗어나면 녹음이 중단됩니다. 계속하시겠습니까?';
        return e.returnValue;
      }
    };

    // 라우트 변경 감지 (React Router 내부 이동)
    const handleRouteChange = () => {
      if (isRecording) {
        // Alert 표시 로직으로 대체
        showAlertMessage('녹음 중입니다. 페이지를 벗어나면 녹음이 중단됩니다. 계속하시겠습니까?', 'red');
        // 실제 라우팅 처리는 Alert의 확인/취소 버튼 핸들러에서 처리
        return false;
      }
      return true;
    };

    // 브라우저 네비게이션 이벤트에 리스너 추가
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 클린업 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // 녹음 중 상태였다면 마이크 해제 알림
      if (isRecording) {
        console.log('컴포넌트 언마운트: 녹음 중지 및 마이크 해제');
        // 실제 정리는 useRecorder의 useEffect에서 수행됨
      }
    };
  }, [isRecording]);

  // 재생 또는 녹음 중일 때 릴 회전 애니메이션
  const isRecordingOrPlaying = isPlaying || isRecording;

  return (
    <>
      {showAlert && (
        <Alert 
          message={alertMessage} 
          color={alertColor} 
          showButtons={true}
          confirmButton={() => {
            // 확인 버튼 처리 - 녹음 중지 후 페이지 이동
            setShowAlert(false);
            // 여기서 필요한 정리 작업 수행
          }}
          cancelButton={() => {
            // 취소 버튼 처리 - 알림만 닫기
            setShowAlert(false);
          }}
        />
      )}
      
      <LetterContainer className="h-[95.5%] w-[100%] flex">
        {/* 카세트 이미지 컴포넌트 */}
        <CassetteImage
          isRecordingOrPlaying={isRecordingOrPlaying}
          selectedDate={selectedDate}
        />

        {/* 녹음 및 재생 컨트롤 컴포넌트 */}
        <CassettePlayer
          onPlayingChange={setIsPlaying}
          onRecordingChange={setIsRecording}
        />

        {/* 파도 애니메이션 컴포넌트 */}
        <WaveAnimation />

        {/* 애니메이션 스타일 */}
        <AnimationStyles />
      </LetterContainer>
    </>
  );
}

export default CassetteContent;