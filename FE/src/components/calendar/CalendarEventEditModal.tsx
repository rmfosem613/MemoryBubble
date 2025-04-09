import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
// import { Link } from 'lucide-react';
import useCalendarEventStore from '@/stores/useCalendarEventStore';
import { updateSchedule } from '@/apis/useCalendarApi';
import useUserStore from '@/stores/useUserStore';

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
  showAlert: (message: string, color: string) => void;
}

function CalendarEventEditModal({
  isOpen,
  close,
  event,
  showAlert,
}: CalendarEventEditModalProps) {
  if (!event) return null;

  const { updateEvent, startYear, endYear } = useCalendarEventStore();
  const { user } = useUserStore();
  const [scheduleContent, setScheduleContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    date: '',
  });

  useEffect(() => {
    if (event) {
      setScheduleContent(event.scheduleContent || '');
      setStartDate(event.startDate || '');
      setEndDate(event.endDate || '');
      setErrors({ title: '', date: '' });
      setIsLoading(false);
    }
  }, [isOpen, event]);

  // 제출
  const handleSubmit = async () => {
    if (!event) return false;

    // 에러 메시지가 있는지 확인
    if (errors.title || errors.date) {
      return false; // 에러가 있으면 제출 중단
    }

    // 빈값 확인 (최종 확인)
    if (!scheduleContent.trim()) {
      setErrors((prev) => ({ ...prev, title: '일정을 입력해주세요.' }));
      return false;
    }

    // api 요청
    setIsLoading(true);

    try {
      console.log('요청할 데이터:', {
        familyId: user.familyId,
        startDate,
        endDate,
        content: scheduleContent,
      });

      const response = await updateSchedule(event.scheduleId, {
        familyId: user.familyId,
        startDate,
        endDate,
        content: scheduleContent,
      });

      if (response.status === 200) {
        // 스토어 상태 업데이트
        updateEvent(event.scheduleId, response.data);
        showAlert('일정이 수정되었습니다.', 'green');
        return true;
      }
    } catch (error) {
      console.error('일정 수정 실패:', error);
      showAlert('일정 수정에 실패했습니다. 다시 시도해주세요.', 'red');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 일정 내용 변경 처리 함수 추가
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // 50자 이하일 때만 상태 업데이트
    if (newValue.length <= 50) {
      setScheduleContent(newValue);
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  // 일정 내용 blur 처리 함수 추가
  const handleContentBlur = () => {
    // 양쪽 공백 제거하고 바로 상태 업데이트
    const trimmedContent = scheduleContent.trim();
    setScheduleContent(trimmedContent);

    // 빈값 유효성 검사
    if (!trimmedContent) {
      setErrors((prev) => ({ ...prev, title: '일정을 입력해주세요.' }));
    }
  };

  // 시작 날짜 변경 수정
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // 시작일이 비어있는지 확인
    if (!newStartDate || !endDate) {
      setErrors((prev) => ({ ...prev, date: '날짜를 선택해주세요.' }));
      return;
    }

    // 시작일이 종료일보다 나중이면 종료일을 시작일과 같게 설정
    const start = new Date(newStartDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    if (start > end) {
      setEndDate(newStartDate);
    }

    // 에러가 없으면 에러 메시지 초기화
    setErrors((prev) => ({ ...prev, date: '' }));
  };

  // 종료 날짜 변경 수정
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    // 종료일이 비어있는지 확인
    if (!startDate || !newEndDate) {
      setErrors((prev) => ({ ...prev, date: '날짜를 선택해주세요.' }));
      return;
    }

    // 종료일이 시작일보다 이전이면 시작일을 종료일과 같게 설정
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(newEndDate + 'T00:00:00');
    if (end < start) {
      setStartDate(newEndDate);
    }

    // 에러가 없으면 에러 메시지 초기화
    setErrors((prev) => ({ ...prev, date: '' }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleSubmit}
      title="일정 수정"
      cancelButtonText="취소하기"
      confirmButtonText={isLoading ? '수정 중...' : '수정완료'}>
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
            onChange={handleContentChange}
            onBlur={handleContentBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // 엔터 키 기본 동작 방지
              }
            }}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        {/* 기간 */}
        <div className="flex flex-col gap-1 mb-6">
          <label htmlFor="event-date">
            기간{' '}
            <span className="text-sm text-gray-500">
              (날짜를 선택해주세요.)
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="start-date"
              type="date"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full hover:cursor-pointer"
              value={startDate}
              onChange={handleStartDateChange}
              min={`${startYear}-01-01`}
              max={`${endYear}-12-31`}
              onKeyDown={(e) => e.preventDefault()}
            />
            <span className="px-2">~</span>
            <input
              id="end-date"
              type="date"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full hover:cursor-pointer"
              value={endDate}
              onChange={handleEndDateChange}
              min={`${startYear}-01-01`}
              max={`${endYear}-12-31`}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        {/* 앨범 연결 */}
        {/* <button className="flex items-center gap-1">
          <Link size={16} />
          <p>{event.albumId ? '앨범 연결 변경' : '앨범 연결'}</p>
        </button> */}
      </div>
    </Modal>
  );
}

export default CalendarEventEditModal;
