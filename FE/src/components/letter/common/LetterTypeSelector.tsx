import { useEffect, useState } from 'react';
import { useLetterStore } from '@/stores/useLetterStore';
import Alert from '@/components/common/Alert';

function LetterTypeSelector() {
  const { letterType, setLetterType, cassetteData } = useLetterStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");
  const [pendingType, setPendingType] = useState<'TEXT' | 'AUDIO' | null>(null);

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 타입 전환 핸들러
  const handleTypeChange = (type: 'TEXT' | 'AUDIO') => {
    // 현재 선택된 타입과 같은 경우 무시
    if (letterType === 'AUDIO' && type === 'TEXT') {
      // 녹음 중일 때는 타입 변경 막기
      if (cassetteData.isRecording) {
        showAlertMessage('녹음이 진행 중입니다. 녹음을 중지한 후 변경할 수 있습니다.', 'red');
        return; // 타입 변경 중단
      }
      // 녹음된 내용만 있는 경우
      else if (cassetteData.isRecorded) {
        showAlertMessage('보내지 않은 카세트 편지가 있습니다. 녹음 상태를 초기화해 주세요.', 'red');
        setPendingType(type);
        return;
      }
    }
    setLetterType(type);

  };

  return (
    <>
      {showAlert && (
        <Alert
          message={alertMessage}
          color={alertColor}
          showButtons={true}
          confirmButton={() => {
            // 확인 버튼 처리 - 타입 변경
            if (pendingType) {
              setLetterType(pendingType);
              setPendingType(null);
            }
            setShowAlert(false);
          }}
          cancelButton={() => {
            // 취소 버튼 처리 - 타입 변경 취소
            setPendingType(null);
            setShowAlert(false);
          }}
        />
      )}

      <div className="border-2 border-gray-300 h-[46px] rounded-[8px] grid grid-cols-2">
        <div className="flex p-1" onClick={() => handleTypeChange('TEXT')}>
          <div
            className={`${letterType === 'TEXT' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded-[8px] h-full w-full flex items-center justify-center transition-colors duration-200 cursor-pointer`}>
            <p
              className={`${letterType === 'TEXT' ? 'text-lg-lg text-white' : 'text-subtitle-1-lg font-p-500 text-gray-600'}`}>
              텍스트 편지
            </p>
          </div>
        </div>
        <div className="flex p-1" onClick={() => handleTypeChange('AUDIO')}>
          <div
            className={`${letterType === 'AUDIO' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded-[8px] h-full w-full flex items-center justify-center transition-colors duration-200 cursor-pointer`}>
            <p
              className={`${letterType === 'AUDIO' ? 'text-lg-lg text-white' : 'text-subtitle-1-lg font-p-500 text-gray-600'}`}>
              카세트 편지
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LetterTypeSelector;