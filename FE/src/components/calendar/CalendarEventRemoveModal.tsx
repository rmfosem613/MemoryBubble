import React from 'react';
import Modal from '../common/Modal/Modal';
import { useCalendarEventStore } from '@/stores/useCalendarEventStore';

interface CalendarEventRemoveModalProps {
  isOpen: boolean;
  close: () => void;
  event: {
    scheduleId: number;
    scheduleContent: string;
  } | null;
}

function CalendarEventRemoveModal({
  isOpen,
  close,
  event,
}: CalendarEventRemoveModalProps) {
  if (!event) return null;
  const { removeEvent } = useCalendarEventStore();

  const handleConfirm = () => {
    // axios 요청

    removeEvent(event.scheduleId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="일정 삭제"
      cancelButtonText="취소하기"
      confirmButtonText="삭제하기"
      onConfirm={handleConfirm}>
      <p className="py-4">
        [ <span className="text-blue-500">{event.scheduleContent}</span> ]
        일정을 삭제하시겠습니까?
      </p>
    </Modal>
  );
}

export default CalendarEventRemoveModal;
