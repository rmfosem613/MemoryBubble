import { useState } from 'react';
import { useLetterStore } from '@/stores/useLetterStore';
import Modal from '@/components/common/Modal/Modal';
import Alert from '@/components/common/Alert';

function LetterTypeSelector() {
  const {
    letterType,
    setLetterType,
    cassetteData,
    updateCassetteData,
    setTextContent,
  } = useLetterStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('red');
  // const [pendingType, setPendingType] = useState<'TEXT' | 'AUDIO' | null>(null);

  // 모달 관련 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState<
    'TEXT_FROM_AUDIO' | 'AUDIO_FROM_TEXT' | null
  >(null);

  const { textContent } = useLetterStore();

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = 'red') => {
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
    if (letterType === type) return;

    if (letterType === 'AUDIO' && type === 'TEXT') {
      // 녹음 중일 때는 타입 변경 막기
      if (cassetteData.isRecording) {
        showAlertMessage(
          '녹음이 진행 중입니다. 녹음을 중지한 후 변경할 수 있습니다.',
          'red',
        );
        return; // 타입 변경 중단
      }
      // 녹음된 내용만 있는 경우 - 모달 표시로 변경
      else if (cassetteData.isRecorded) {
        setModalMessage('녹음 음성이 있습니다. 이동하면 내용이 사라집니다.');
        setModalAction('TEXT_FROM_AUDIO');
        setIsModalOpen(true);
        return;
      }
    }

    if (letterType === 'TEXT' && type === 'AUDIO') {
      // 텍스트 편지에 내용이 있는지 확인
      if (textContent && textContent.trim() !== '') {
        setModalMessage(
          '작성 중이던 편지가 있습니다. 이동하면 내용이 사라집니다.',
        );
        setModalAction('AUDIO_FROM_TEXT');
        setIsModalOpen(true);
        return;
      }
    }

    // 제약 조건이 없는 경우 바로 타입 변경
    setLetterType(type);
  };

  // 모달 확인 버튼 핸들러
  const handleModalConfirm = () => {
    if (modalAction === 'TEXT_FROM_AUDIO') {
      // 녹음 내용 초기화
      updateCassetteData({
        isRecorded: false,
        isRecording: false,
        recordingUrl: null,
        recordingDuration: 0,
      });

      // 텍스트 편지로 변경
      setLetterType('TEXT');
    } else if (modalAction === 'AUDIO_FROM_TEXT') {
      // 텍스트 내용 초기화
      setTextContent('');
      setLetterType('AUDIO');
    }

    // 모달 닫기
    setIsModalOpen(false);
    setModalAction(null);

    return true; // 모달을 닫습니다
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}

      {/* 모달 컴포넌트 추가 */}
      <Modal
        isOpen={isModalOpen}
        title="편지 타입 변경"
        confirmButtonText="확인"
        cancelButtonText="취소"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}>
        <p>{modalMessage}</p>
      </Modal>

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
