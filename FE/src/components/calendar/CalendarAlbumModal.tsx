import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import DropDown from '../common/Modal/DropDown';
import useCalendarEventStore from '@/stores/useCalendarEventStore';
import { linkAlbumToSchedule } from '@/apis/useCalendarApi';

interface CalendarAlbumModalProps {
  isOpen: boolean;
  close: () => void;
  scheduleId: number;
  currentAlbumId: number | null;
  allAlbums: { id: number; title: string, photoCount: number }[];
  showAlert: (message: string, color: string) => void;
}

function CalendarAlbumModal({
  isOpen,
  close,
  scheduleId,
  currentAlbumId = null,
  allAlbums,
  showAlert,
}: CalendarAlbumModalProps) {
  const { updateEvent } = useCalendarEventStore();
  const [targetAlbumId, setTargetAlbumId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isConfirmButtonDisabled =
    !targetAlbumId || targetAlbumId === currentAlbumId;

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 현재 연결된 앨범 ID로 초기화
      setTargetAlbumId(currentAlbumId);
    } else {
      // 모달이 닫힐 때 상태 초기화
      setTargetAlbumId(null);
    }
  }, [isOpen, currentAlbumId]);

  // 앨범 선택
  const handleTargetAlbumSelect = (selectedAlbumId: number) => {
    setTargetAlbumId(selectedAlbumId);
  };

  const handleConfirm = async () => {
    if (isConfirmButtonDisabled) {
      return false; // 모달 닫기 방지
    }

    // API 요청
    setIsLoading(true);

    try {
      const response = await linkAlbumToSchedule(scheduleId, {
        albumId: targetAlbumId,
      });

      if (response.status === 200) {
        // 스토어 상태 업데이트
        updateEvent(scheduleId, response.data);
        showAlert('일정에 앨범이 연결되었습니다.', 'green');
        return true;
      }
    } catch (error) {
      console.error('앨범 연결 실패:', error);
      showAlert('일정 연결에 실패했습니다. 다시 시도해주세요.', 'red');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      // key={`album-modal-${scheduleId}-${isOpen}`} // 고유 키 추가
      isOpen={isOpen}
      onClose={close}
      title="앨범 연결하기"
      confirmButtonText={isLoading ? '연결 중...' : '연결하기'}
      cancelButtonText="취소하기"
      onConfirm={handleConfirm}
      isConfirmDisabled={isConfirmButtonDisabled}>
      <div className="py-2">
        <p className="mb-4">
          연결할 앨범을 선택해주세요.{' '}
          <span className="text-sm text-gray-600">
            (선택된 앨범은 목록에 표시되지 않습니다.)
          </span>
        </p>
        <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">
          앨범 선택하기
        </p>
        <DropDown
          albums={allAlbums.slice(1)}
          currentAlbumId={targetAlbumId}
          onSelectAlbum={handleTargetAlbumSelect}
          placeholder="앨범을 선택해주세요"
        />
      </div>
    </Modal>
  );
}

export default CalendarAlbumModal;
