import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import { Link } from 'lucide-react';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useCalendarEventStore } from '@/stores/useCalendarEventStore';

interface CalendarEventEditModalProps {
  isOpen: boolean;
  close: () => void;
  event: {
    scheduleId: number;
    scheduleContent: string;
    startDate?: string;
    endDate?: string;
    albumId?: number | null;
  } | null;
}

function CalendarEventEditModal({
  isOpen,
  close,
  event,
}: CalendarEventEditModalProps) {
  if (!event) return null;

  const { selectDate } = useCalendarStore();
  const { updateEvent } = useCalendarEventStore();
  const [scheduleContent, setScheduleContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    date: '',
  });

  useEffect(() => {
    setScheduleContent(event.scheduleContent);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
  }, [isOpen, event]);

  // 제출
  const handleSubmit = () => {
    if (!event) return false;

    const newErrors = { title: '', date: '' };
    // 일정 유효성 검사
    if (scheduleContent.trim() === '') {
      newErrors.title = '일정을 입력해주세요.';
    }
    // 날짜 유효성 검사
    if (!startDate || !endDate) {
      newErrors.date = '날짜를 입력(선택)해주세요.';
    }
    setErrors(newErrors);

    // 에러 메시지가 하나라도 있으면 false 반환
    if (newErrors.title || newErrors.date) {
      return false;
    }

    // axios 요청

    updateEvent(event.scheduleId, {
      scheduleContent,
      startDate,
      endDate,
    });
  };

  // 시작 날짜 변경
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setErrors((prev) => ({ ...prev, date: '' })); // 날짜 에러 메시지 초기화

    // 시작일이 종료일보다 나중이면 종료일을 시작일과 같게 설정
    const start = new Date(newStartDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    if (start > end) {
      setEndDate(newStartDate);
    }
  };

  // 종료 날짜 변경
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setErrors((prev) => ({ ...prev, date: '' })); // 날짜 에러 메시지 초기화

    // 종료일이 시작일보다 이전이면 시작일을 종료일과 같게 설정
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(newEndDate + 'T00:00:00');
    if (end < start) {
      setStartDate(newEndDate);
    }
  };

  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleSubmit}
      title="일정 수정"
      cancelButtonText="취소하기"
      confirmButtonText="수정완료">
      <div className="flex flex-col gap-4 px-2">
        <p className="text-gray-600">
          일정 정보를 수정하고 가족들과 공유해보세요
        </p>
        {/* 일정 */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="event-title">일정</label>
            <span className="text-sm text-gray-500">
              {scheduleContent.length}/50
            </span>
          </div>
          <textarea
            id="event-title"
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder="일정을 입력해주세요"
            value={scheduleContent}
            maxLength={50}
            rows={2}
            onChange={(e) => {
              setErrors((prev) => ({ ...prev, title: '' }));
              setScheduleContent(e.target.value);
            }}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        {/* 기간 */}
        <div className="flex flex-col gap-1 mb-14">
          <label htmlFor="event-date">기간</label>
          <div className="flex items-center gap-2">
            <input
              id="start-date"
              type="date"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full hover:cursor-pointer"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <span className="px-2">~</span>
            <input
              id="end-date"
              type="date"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full hover:cursor-pointer"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        {/* 앨범 연결 */}
        <button className="flex items-center gap-1">
          <Link size={16} />
          <p>{event.albumId ? '앨범 연결 변경' : '앨범 연결'}</p>
        </button>
      </div>
    </Modal>
  );
}

export default CalendarEventEditModal;
