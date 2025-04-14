import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import useCalendarEventStore from '@/stores/useCalendarEventStore';
import { deleteSchedule } from '@/apis/useCalendarApi';

interface CalendarEventRemoveModalProps {
  isOpen: boolean;
  close: () => void;
  event: {
    scheduleId: number;
    scheduleContent: string;
  } | null;
  showAlert: (message: string, color: string) => void; // 추가된 prop
}

function CalendarEventRemoveModal({
  isOpen,
  close,
  event,
  showAlert,
}: CalendarEventRemoveModalProps) {
  if (!event) return null;

  const { removeEvent } = useCalendarEventStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!event) return false;

    // 삭제 요청 시작
    setIsLoading(true);

    try {
      // 일정 삭제 API 호출
      const response = await deleteSchedule(event.scheduleId);

      if (response.status === 200) {
        // 스토어에서 일정 제거
        removeEvent(event.scheduleId);
        showAlert('일정이 삭제되었습니다.', 'green');
        return true;
      }
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      showAlert('일정 삭제에 실패했습니다. 다시 시도해주세요.', 'red');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="일정 삭제"
      cancelButtonText="취소하기"
      confirmButtonText={isLoading ? '삭제 중...' : '삭제하기'}
      onConfirm={handleConfirm}>
      <p className="py-4">
        [ <span className="text-blue-500">{event.scheduleContent}</span> ]
        일정을 삭제하시겠습니까?
      </p>
    </Modal>
  );
}

export default CalendarEventRemoveModal;
