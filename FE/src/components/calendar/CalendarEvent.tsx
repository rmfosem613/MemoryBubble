import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CirclePlus, Link, Trash2, PenLine } from 'lucide-react';
import { useCalendarEventStore } from '@/stores/useCalendarEventStore';
import useCalendarApi from '@/apis/useCalendarApi';
import useModal from '@/hooks/useModal';
import { usePhotoAlbum } from '@/hooks/usePhotoAlbum';
import CalendarEventAddModal from './CalendarEventAddModal';
import CalendarEventRemoveModal from './CalendarEventRemoveModal';
import CalendarEventEditModal from './CalendarEventEditModal';
import CalendarAlbumModal from './CalendarAlbumModal';

function CalendarEvent() {
  const navigate = useNavigate();
  const { getEventsByDate, events, selectDate, updateEvent } =
    useCalendarEventStore();
  const { linkAlbumToSchedule } = useCalendarApi();
  const { allAlbums } = usePhotoAlbum(); // 앨범 목록을 가져옴
  const [openEvents, setOpenEvents] = useState<Record<number, boolean>>({});
  const [selectEvent, setSelectEvent] = useState<{
    scheduleId: number;
    scheduleContent: string;
    startDate?: string;
    endDate?: string;
    albumId?: number | null;
  } | null>(null);
  const calendarEventAddModal = useModal(false);
  const calendarEventRemoveModal = useModal(false);
  const calendarEventEditModal = useModal(false);
  const calendarAlbumModal = useModal(false);

  // 앨범 ID로 앨범 이름 찾기
  const getAlbumNameById = (albumId: number | null) => {
    if (!albumId) return '앨범';

    const album = allAlbums.find((album) => album.id === albumId);
    return album ? album.title : '앨범';
  };

  // 토글 이벤트 함수
  const toggleEvent = (scheduleId: number) => {
    setOpenEvents((prev) => ({
      ...prev,
      [scheduleId]: !prev[scheduleId],
    }));
  };

  // 선택된 날짜에 해당하는 이벤트 필터링
  const filteredEvents = useMemo(() => {
    return getEventsByDate(selectDate);
  }, [getEventsByDate, selectDate, events]);

  // 앨범 연결 모달 열기
  const openAlbumModal = (event) => {
    setSelectEvent(event);
    calendarAlbumModal.open();
  };

  // 앨범 연결 해제
  const handleUnlinkAlbum = async (scheduleId: number) => {
    try {
      // API 호출: albumId를 null로 설정
      const response = await linkAlbumToSchedule(scheduleId, {
        albumId: null,
      });

      if (response.status === 200) {
        // 스토어 업데이트
        updateEvent(scheduleId, response.data);
      }
    } catch (error) {
      console.error('앨범 연결 해제 실패:', error);
      alert('앨범 연결 해제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 연결된 앨범으로 이동
  const navigateToAlbum = (albumId: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (albumId) {
      navigate(`/album/${albumId}`);
    }
  };

  // 삭제 모달 열기
  const openRemoveModal = (scheduleId: number, scheduleContent: string) => {
    setSelectEvent({ scheduleId, scheduleContent });
    calendarEventRemoveModal.open();
  };

  // 수정 모달 열기
  const openEditModal = (event) => {
    setSelectEvent(event);
    calendarEventEditModal.open();
  };

  return (
    <>
      <div className="w-full h-full lg:pt-[65px] px-6 pb-4 flex flex-col space-y-3">
        {/* -- 일정 헤더 -- */}
        <div className="flex justify-between pt-2">
          {/* 선택날짜 */}
          <h2 className="text-h3-lg font-p-700">
            {selectDate.getMonth() + 1}월 {selectDate.getDate()}일
          </h2>
          {/* 일정추가 */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:bg-winter-200/20 rounded-full px-1"
            onClick={(e) => {
              e.stopPropagation();
              calendarEventAddModal.open();
            }}>
            <div className="relative">
              <div className="absolute w-4 h-4 bg-winter-200 rounded-full -bottom-0.5 -right-0.5"></div>
              <CirclePlus size={20} className="relative z-10" />
            </div>
            <span className="text-h5-lg font-p-500">일정 추가</span>
          </div>
        </div>

        {/* -- 일정 목록 -- */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.scheduleId} className="mb-3">
                {/* 일정 */}
                <div className="flex flex-col pb-2 border-b-2 border-dashed border-winter-200 cursor-pointer">
                  <div
                    className="px-2 flex justify-between items-center"
                    onClick={() => toggleEvent(event.scheduleId)}>
                    <p className="p-1 text-h4-lg font-p-500">
                      {event.scheduleContent}
                    </p>
                    {event.albumId ? <Link size={20} /> : ''}
                  </div>
                  {/* 일정상세 */}
                  {openEvents[event.scheduleId] && (
                    <div className="flex flex-col space-y-2 p-3 pb-1 bg-white text-subtitle-1-lg font-p-500">
                      <p>
                        {event.startDate.replace(/-/g, '/')} ~{' '}
                        {event.endDate.replace(/-/g, '/')}
                      </p>
                      <div
                        className={`flex items-center space-x-1 ${
                          event.albumId
                            ? 'text-winter-300 font-p-700'
                            : 'text-gray-500'
                        }`}>
                        {event.albumId ? (
                          <div
                            className="flex items-center space-x-1 cursor-pointer hover:underline"
                            onClick={(e) => navigateToAlbum(event.albumId, e)}>
                            <Link size={17} strokeWidth={3} />
                            <p>{getAlbumNameById(event.albumId)}</p>
                          </div>
                        ) : (
                          <>
                            <Link size={17} strokeWidth={2} />
                            <p>앨범</p>
                          </>
                        )}

                        {/* 앨범ID가 있을 때 다시연결하기와 연결끊기 버튼 추가 */}
                        {event.albumId && (
                          <div className="ml-auto flex space-x-2">
                            <button
                              className="px-2 py-1 text-xs rounded-md bg-winter-100 hover:bg-winter-200/50 text-gray-500 font-p-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAlbumModal(event);
                              }}>
                              연결하기
                            </button>
                            <button
                              className="px-2 py-1 text-xs rounded-md bg-red-100 hover:bg-red-200/30 text-gray-500 font-p-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlinkAlbum(event.scheduleId);
                              }}>
                              연결끊기
                            </button>
                          </div>
                        )}

                        {/* 앨범ID가 없을 때 앨범 연결하기 버튼 추가 */}
                        {!event.albumId && (
                          <button
                            className="ml-auto px-2 py-1 text-xs rounded-md bg-winter-100 hover:bg-winter-200/50 text-gray-500 font-p-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAlbumModal(event);
                            }}>
                            연결하기
                          </button>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded-full hover:bg-winter-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(event);
                          }}>
                          <PenLine size={20} />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-winter-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRemoveModal(
                              event.scheduleId,
                              event.scheduleContent,
                            );
                          }}>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-winter-200 text-h5-lg font-p-500">
              해당 날짜에 일정이 없습니다.
            </div>
          )}
        </div>
      </div>
      {/* 추가 모달 */}
      <CalendarEventAddModal
        isOpen={calendarEventAddModal.isOpen}
        close={calendarEventAddModal.close}
      />
      {/* 삭제 모달 */}
      <CalendarEventRemoveModal
        isOpen={calendarEventRemoveModal.isOpen}
        close={calendarEventRemoveModal.close}
        event={selectEvent}
      />
      {/* 수정 모달 */}
      <CalendarEventEditModal
        isOpen={calendarEventEditModal.isOpen}
        close={calendarEventEditModal.close}
        event={selectEvent}
      />
      {/* 앨범 연결 모달 */}
      {selectEvent && (
        <CalendarAlbumModal
          isOpen={calendarAlbumModal.isOpen}
          close={calendarAlbumModal.close}
          scheduleId={selectEvent.scheduleId}
          currentAlbumId={selectEvent.albumId || null}
          allAlbums={allAlbums}
        />
      )}
    </>
  );
}

export default CalendarEvent;
