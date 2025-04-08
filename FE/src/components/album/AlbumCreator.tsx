import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import InputText from '@/components/common/Modal/InputText';
import AlbumColorPicker from './AlbumColorPicker';
import { createAlbum } from '@/apis/albumApi';

import Alert from '../common/Alert';

interface AlbumCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: number;
  onCreateComplete: () => Promise<void>;
}

const AlbumCreator = ({
  isOpen,
  onClose,
  familyId,
  onCreateComplete,
}: AlbumCreatorProps) => {
  // 앨범 생성 폼 상태 관리
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#f4e2dc'); // 기본 색상
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

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

  // 폼 입력 검증
  const validateAlbumForm = () => {
    if (!albumName.trim()) {
      showAlertMessage('앨범 이름을 입력해주세요.', 'red');
      return false;
    }
    return true;
  };

  // 앨범 생성 시작 (동기 함수)
  const handleCreateAlbumStart = () => {
    if (!validateAlbumForm() || isCreatingAlbum) {
      return false; // 모달 닫기 방지
    }

    setIsCreatingAlbum(true);

    // 비동기 처리 시작 - 결과는 별도로 처리
    createAlbumProcess();

    return false; // 모달은 API 호출 완료 후 수동으로 닫을 것임
  };

  // 실제 앨범 생성 프로세스 (비동기)
  const createAlbumProcess = async () => {
    try {
      // 앨범 생성 요청
      await createAlbum({
        familyId: familyId || 0,
        albumName: albumName.trim(),
        albumContent: albumDescription.trim(),
        backgroundColor: selectedColor,
      });

      // 앨범 목록 다시 불러오기
      await onCreateComplete();

      // 입력 필드 초기화
      setAlbumName('');
      setAlbumDescription('');
      setSelectedColor('#f4e2dc');

      // 모달 닫기
      onClose();
    } catch (error) {
      showAlertMessage('앨범 생성에 실패했습니다. 다시 시도해주세요.', 'red');
    } finally {
      setIsCreatingAlbum(false);
    }
  };

  // 색상 선택 핸들러
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="앨범 생성"
        confirmButtonText={isCreatingAlbum ? '생성 중...' : '생성하기'}
        cancelButtonText="취소하기"
        onConfirm={handleCreateAlbumStart}>
        <div className="py-2">
          <p className="mb-4">새로운 추억보관함을 생성해보세요!</p>
          <p className="text-subtitle-1-lg font-p-500 text-black">
            앨범 이름 (최대 7자)
          </p>
          <InputText
            value={albumName}
            onChange={(e) => {
              if (e.length <= 7) {
                setAlbumName(e);
              }
            }}
            maxLength={7}
            placeholder="앨범 이름을 입력해주세요 (필수)"
          />
          <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">
            앨범 한 줄 설명 (최대 60자)
          </p>
          <InputText
            value={albumDescription}
            onChange={(e) => {
              if (e.length <= 60) {
                setAlbumDescription(e);
              }
            }}
            maxLength={60}
            placeholder="앨범 설명을 입력해주세요 (선택)"
          />
          <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">
            표지색 정하기
          </p>

          <AlbumColorPicker
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
        </div>
      </Modal>
    </>
  );
};

export default AlbumCreator;
