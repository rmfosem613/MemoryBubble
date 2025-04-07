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
  const [isLoading, setIsLoading] = useState(false);

  const handleTargetAlbumSelect = (selectedAlbumId: number) => {
    setTargetAlbumId(selectedAlbumId);
  };

  const handleConfirm = async () => {
    if (!targetAlbumId) {
      alert('앨범을 선택해주세요');
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
        return true;
      }
    } catch (error) {
      console.error('앨범 연결 실패:', error);
      alert('앨범 연결에 실패했습니다. 다시 시도해주세요.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="앨범 연결하기"
      confirmButtonText={isLoading ? '연결 중...' : '연결하기'}
      cancelButtonText="취소하기"
      onConfirm={handleConfirm}>
      <div className="py-2">
        <p className="mb-4">연결할 앨범을 선택해주세요.</p>
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
