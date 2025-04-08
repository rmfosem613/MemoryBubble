import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal/Modal';
// import { Link } from 'lucide-react';
import useCalendarEventStore from '@/stores/useCalendarEventStore';
import { createSchedule } from '@/apis/useCalendarApi';
import useUserStore from '@/stores/useUserStore';
// import DropDown from '../common/Modal/DropDown';
// import { usePhotoAlbum } from '@/hooks/usePhotoAlbum';

interface CalendarEventAddModalProps {
  isOpen: boolean;
  close: () => void;
  showAlert: (message: string, color: string) => void;
}

function CalendarEventAddModal({
  isOpen,
  close,
  showAlert,
}: CalendarEventAddModalProps) {
  const { selectDate, addEvent, startYear, endYear } = useCalendarEventStore();
  const { user } = useUserStore();

  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    date: '',
  });

  // const { allAlbums } = usePhotoAlbum();
  // const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  // const [isAlbumSelectorOpen, setIsAlbumSelectorOpen] = useState(false);

  // 컴포넌트 마운트 시 선택 날짜로 초기화
  useEffect(() => {
    const formattedDate = `${selectDate.getFullYear()}-${String(selectDate.getMonth() + 1).padStart(2, '0')}-${String(selectDate.getDate()).padStart(2, '0')}`;
    setEventTitle('');
    setStartDate(formattedDate);
    setEndDate(formattedDate);
    setErrors({ title: '', date: '' });
    setIsLoading(false);
  }, [isOpen, selectDate]);

  // 제출
  const handleSubmit = async () => {
    // 양쪽 공백 제거
    const trimmedTitle = eventTitle.trim();
    setEventTitle(trimmedTitle);

    // 빈값 유효성 검사
    if (!trimmedTitle) {
      setErrors((prev) => ({ ...prev, title: '일정을 입력해주세요.' }));
      return false;
    }

    // 유효한 경우
    setErrors((prev) => ({ ...prev, title: '' }));

    // api 요청
    setIsLoading(true);

    try {
      // 일정 추가 API 호출
      const response = await createSchedule({
        familyId: user.familyId,
        startDate,
        endDate,
        content: eventTitle,
        albumId: null,
      });

      if (response.status === 200) {
        // 스토어에 새 일정 추가
        addEvent(response.data);
        showAlert('일정이 등록되었습니다.', 'green');
        return true;
      }
    } catch (error) {
      console.error('일정 추가 실패:', error);
      showAlert('일정 등록에 실패했습니다. 다시 시도해주세요.', 'red');
      return false;
    } finally {
      setIsLoading(false);
    }
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

  // 앨범 연결
  // const handleAlbumSelect = (albumId: number) => {
  //   setSelectedAlbumId(albumId);
  // };

  // 앨범 연결 토글
  // const toggleAlbumSelector = () => {
  //   setIsAlbumSelectorOpen(!isAlbumSelectorOpen);
  // };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      onConfirm={handleSubmit}
      title="새 일정 등록"
      cancelButtonText="취소하기"
      confirmButtonText={isLoading ? '등록 중...' : '등록하기'}>
      <div className="flex flex-col gap-4 px-2">
        <p className="text-gray-600">
          새로운 일정을 등록하고 가족들과 공유해봅시다
        </p>
        {/* 일정 */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="event-title">일정</label>
            <span className="text-sm text-gray-500">
              {eventTitle.length}/50
            </span>
          </div>
          <textarea
            id="event-title"
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder="일정을 입력해주세요"
            value={eventTitle}
            maxLength={50}
            rows={2}
            onChange={(e) => {
              setErrors((prev) => ({ ...prev, title: '' }));
              if(e.target.value.length > 50) return;
              setEventTitle(e.target.value);
            }}
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
        {/* <div className="flex flex-col gap-1">
          <button
            className="flex items-center gap-1 text-winter-300 mb-2"
            onClick={toggleAlbumSelector}>
            <Link size={16} />
            <p>{selectedAlbumId ? '앨범 연결됨' : '앨범 연결하기'}</p>
          </button>

          {isAlbumSelectorOpen && (
            <div className="py-2">
              <p className="mb-4">연결할 앨범을 선택해주세요.</p>
              <DropDown
                albums={allAlbums}
                onSelectAlbum={handleAlbumSelect}
                placeholder="앨범을 선택해주세요"
              />
            </div>
          )}
        </div> */}
      </div>
    </Modal>
  );
}

export default CalendarEventAddModal;
