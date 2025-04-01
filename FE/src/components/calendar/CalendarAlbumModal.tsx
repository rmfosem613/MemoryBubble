import React, { useState } from 'react';
import Modal from '../common/Modal/Modal';
import DropDown from '../common/Modal/DropDown';
import { useCalendarEventStore } from '@/stores/useCalendarEventStore';

interface CalendarAlbumModalProps {
  isOpen: boolean;
  close: () => void;
  scheduleId: number;
  currentAlbumId: number | null;
  allAlbums: { id: number; title: string }[]; // props로 받도록 변경
}

function CalendarAlbumModal({
  isOpen,
  close,
  scheduleId,
  currentAlbumId = null,
  allAlbums, // props에서 받음
}: CalendarAlbumModalProps) {
  const { updateEvent } = useCalendarEventStore();
  const [targetAlbumId, setTargetAlbumId] = useState<number | null>(null);

  const handleTargetAlbumSelect = (selectedAlbumId: number) => {
    setTargetAlbumId(selectedAlbumId);
  };

  const handleConfirm = () => {
    if (!targetAlbumId) {
      alert('앨범을 선택해주세요');
      return false; // 모달 닫기 방지
    }

    // 앨범 연결 및 상태 업데이트
    updateEvent(scheduleId, { albumId: targetAlbumId });

    return true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="앨범 연결하기"
      confirmButtonText="연결하기"
      cancelButtonText="취소하기"
      onConfirm={handleConfirm}>
      <div className="py-2">
        <p className="mb-4">연결할 앨범을 선택해주세요.</p>
        <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">
          앨범 선택하기
        </p>
        <DropDown
          albums={allAlbums}
          currentAlbumId={currentAlbumId}
          onSelectAlbum={handleTargetAlbumSelect}
          placeholder="앨범을 선택해주세요"
        />
      </div>
    </Modal>
  );
}

export default CalendarAlbumModal;
