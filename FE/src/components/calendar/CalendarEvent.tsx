import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CirclePlus, Link, Trash2, PenLine, LoaderCircle } from 'lucide-react';

import useCalendarEventStore from '@/stores/useCalendarEventStore';
import { getMonthColors } from '@/utils/calendarUtils';
import { linkAlbumToSchedule } from '@/apis/useCalendarApi';
import { usePhotoAlbum } from '@/hooks/usePhotoAlbum';
import Alert from '../common/Alert';

import useModal from '@/hooks/useModal';
import CalendarEventAddModal from './CalendarEventAddModal';
import CalendarEventRemoveModal from './CalendarEventRemoveModal';
import CalendarEventEditModal from './CalendarEventEditModal';
import CalendarAlbumModal from './CalendarAlbumModal';

interface EventGroup {
  mainEvent: {
    scheduleId: number;
    scheduleContent: string;
    startDate: string;
    endDate: string;
    albumId: number | null;
  };
  count: number;
}

function CalendarEvent() {
  const navigate = useNavigate();

  // 상태
  const { getEventsByDate, events, selectDate, updateEvent } =
    useCalendarEventStore();
  const colors = getMonthColors(selectDate); // 계절별 색상
  const { allAlbums } = usePhotoAlbum(); // 앨범 목록
  const [openEvents, setOpenEvents] = useState<Record<number, boolean>>({}); // 일정 상세 보기 상태
  const [selectEvent, setSelectEvent] = useState<{
    scheduleId: number;
    scheduleContent: string;
    startDate?: string;
    endDate?: string;
    albumId?: number | null;
  } | null>(null); // 선택된 날짜
  const [unlinkingId, setUnlinkingId] = useState<number | null>(null); // 연결 해제 로딩 상태

  // 모달 상태
  const calendarEventAddModal = useModal(false);
  const calendarEventRemoveModal = useModal(false);
  const calendarEventEditModal = useModal(false);
  const calendarAlbumModal = useModal(false);

  // Alert 관련 상태 추가
  const [customAlert, setcustomAlert] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({
    show: false,
    message: '',
    color: '',
  });

  // 알림 표시 후 3초 후에 상태 리셋
  useEffect(() => {
    if (customAlert.show) {
      const timer = setTimeout(() => {
        setcustomAlert({
          show: false,
          message: '',
          color: '',
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [customAlert.show]);

  const showAlert = (message: string, color: string) => {
    setcustomAlert({
      show: true,
      message,
      color,
    });
  };

  // 앨범 ID로 앨범 이름 찾기
  const getAlbumNameById = (albumId: number | null) => {
    if (!albumId) return '앨범';
    const album = allAlbums.find((album) => album.id === albumId);
    return album ? album.title : '앨범';
  };

  // 일정 상세 보기 - 토글 이벤트 함수
  const toggleEvent = (scheduleId: number) => {
    setOpenEvents((prev) => ({
      ...prev,
      [scheduleId]: !prev[scheduleId],
    }));
  };

  // 선택된 날짜에 해당하는 이벤트 필터링 및 그룹화
  const groupedEvents = useMemo(() => {
    // 선택된 날짜에 해당하는 이벤트들을 먼저 필터링
    const eventsForSelectedDate = getEventsByDate(selectDate);

    // 내용, 시작일, 종료일, 앨범ID가 같은 이벤트들을 그룹화
    const eventGroups = eventsForSelectedDate.reduce<
      Record<string, EventGroup>
    >((groups, event) => {
      // 그룹화 키 생성 (scheduleContent, startDate, endDate, albumId 조합)
      const albumIdString =
        event.albumId === null ? 'null' : event.albumId.toString();
      const groupKey = `${event.scheduleContent}_${event.startDate}_${event.endDate}_${albumIdString}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          mainEvent: { ...event },
          count: 1,
        };
      } else {
        groups[groupKey].count += 1;
      }

      return groups;
    }, {});

    return Object.values(eventGroups);
  }, [getEventsByDate, selectDate, events]);

  // 앨범 연결 해제
  const handleUnlinkAlbum = async (scheduleId: number) => {
    try {
      // 로딩 상태 시작
      setUnlinkingId(scheduleId);

      // API 호출: albumId를 null로 설정
      const response = await linkAlbumToSchedule(scheduleId, {
        albumId: null,
      });

      if (response.status === 200) {
        updateEvent(scheduleId, response.data);
        showAlert('일정과 앨범의 연결이 해제되었습니다.', 'green');
      }
    } catch (error) {
      console.error('앨범 연결 해제 실패:', error);
      showAlert(
        '일정과 앨범 연결 해제에 실패했습니다. 다시 시도해주세요.',
        'red',
      );
    } finally {
      setUnlinkingId(null);
    }
  };

  // 연결된 앨범으로 이동
  const navigateToAlbum = (albumId: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (albumId) {
      navigate(`/album/${albumId}`);
    }
  };

  // 앨범 연결 모달 열기
  const openAlbumModal = (event) => {
    // 연결 가능한 앨범이 있는지 확인 (기본 앨범 외 최소 1개 이상)
    if (allAlbums.length <= 1 || (event.albumId && allAlbums.length <= 2)) {
      showAlert('연결할 수 있는 앨범이 없습니다.', 'red');
      return;
    }

    setSelectEvent(event);
    calendarAlbumModal.open();
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
      {customAlert.show && (
        <Alert message={customAlert.message} color={customAlert.color} />
      )}

      <div
        className={`w-full h-full ${colors.bg[0]} lg:pt-[65px] px-6 pb-4 flex flex-col space-y-3`}>
        {/* -- 일정 헤더 -- */}
        <div className="flex justify-between pt-2">
          {/* 선택날짜 */}
          <h2 className="text-h3-lg font-p-700">
            {selectDate.getMonth() + 1}월 {selectDate.getDate()}일
          </h2>
          {/* 일정추가 */}
          <div
            className={`flex items-center gap-1 cursor-pointer ${colors.hover[1]} rounded-full px-1`}
            onClick={(e) => {
              e.stopPropagation();
              calendarEventAddModal.open();
            }}>
            <div className="relative">
              <div
                className={`absolute w-4 h-4 ${colors.bg[1]} rounded-full -bottom-0.5 -right-0.5`}></div>
              <CirclePlus size={20} className="relative z-10" />
            </div>
            <span className="text-h5-lg font-p-500">일정 추가</span>
          </div>
        </div>

        {/* -- 일정 목록 -- */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {groupedEvents.length > 0 ? (
            groupedEvents.map((eventGroup) => (
              <div key={eventGroup.mainEvent.scheduleId} className="mb-3">
                {/* 일정 */}
                <div
                  className={`flex flex-col pb-2 border-b-2 border-dashed ${colors.border[1]}`}>
                  <>
                    <div
                      className="px-2 flex justify-between items-start cursor-pointer"
                      onClick={() =>
                        toggleEvent(eventGroup.mainEvent.scheduleId)
                      }>
                      <p className="flex-1 p-1 text-h4-lg font-p-500 break-all">
                        {eventGroup.mainEvent.scheduleContent}
                      </p>
                      <div className="flex flex-col space-y-1 items-center pt-2 w-6 h-full">
                        {eventGroup.mainEvent.albumId ? <Link size={20} /> : ''}
                        {eventGroup.count > 1 && (
                          <span
                            className={`${colors.bg[1]} rounded-full px-[6px] ${colors.text[0]} font-p-700`}>
                            {eventGroup.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                  {/* 일정상세 */}
                  {openEvents[eventGroup.mainEvent.scheduleId] && (
                    <div className="flex flex-col space-y-1 p-3 pb-1 bg-white text-subtitle-1-lg font-p-500">
                      <p>
                        {eventGroup.mainEvent.startDate.replace(/-/g, '/')} ~{' '}
                        {eventGroup.mainEvent.endDate.replace(/-/g, '/')}
                      </p>
                      <div
                        className={`flex items-center space-x-1 ${
                          eventGroup.mainEvent.albumId
                            ? `${colors.text[2]} font-p-700`
                            : 'text-gray-500'
                        }`}>
                        {eventGroup.mainEvent.albumId ? (
                          <div
                            className="flex items-center space-x-1 cursor-pointer hover:underline"
                            onClick={(e) =>
                              navigateToAlbum(eventGroup.mainEvent.albumId, e)
                            }>
                            <Link size={17} strokeWidth={3} />
                            <p>
                              {getAlbumNameById(eventGroup.mainEvent.albumId)}
                            </p>
                          </div>
                        ) : (
                          <>
                            <Link size={17} strokeWidth={2} />
                            <p>앨범</p>
                          </>
                        )}

                        {/* 앨범ID가 있을 때 다시연결하기와 연결끊기 버튼 추가 */}
                        {eventGroup.mainEvent.albumId && (
                          // <div className="ml-auto flex space-x-2">
                          //   <button
                          //     className={`px-2 py-1 text-xs rounded-md ${colors.bg[0]} hover:${colors.bg[1]}/50 text-gray-500 font-p-500`}
                          //     onClick={(e) => {
                          //       e.stopPropagation();
                          //       openAlbumModal(eventGroup.mainEvent);
                          //     }}>
                          //     앨범연결
                          //   </button>
                          <button
                            className="px-2 py-1 text-xs rounded-md bg-red-100 hover:bg-red-200/30 text-gray-500 font-p-500 flex items-center justify-center  disabled:hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlinkAlbum(
                                eventGroup.mainEvent.scheduleId,
                              );
                            }}
                            disabled={
                              unlinkingId === eventGroup.mainEvent.scheduleId
                            }>
                            {unlinkingId === eventGroup.mainEvent.scheduleId ? (
                              <LoaderCircle
                                size={16}
                                className={`${colors.text[1]} animate-spin`}
                              />
                            ) : (
                              'X'
                            )}
                          </button>
                          // </div>
                        )}

                        {/* 앨범ID가 없을 때 앨범 연결하기 버튼 추가 */}
                        {!eventGroup.mainEvent.albumId && (
                          <button
                            className={`ml-auto px-2 py-1 text-xs rounded-md ${colors.bg[0]} ${colors.hover[2]} text-gray-500 font-p-500`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openAlbumModal(eventGroup.mainEvent);
                            }}>
                            연결하기
                          </button>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          className={`p-1 rounded-full ${colors.hover[0]}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(eventGroup.mainEvent);
                          }}>
                          <PenLine size={20} />
                        </button>
                        <button
                          className={`p-1 rounded-full ${colors.hover[0]}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openRemoveModal(
                              eventGroup.mainEvent.scheduleId,
                              eventGroup.mainEvent.scheduleContent,
                            );
                          }}>
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* 그룹화된 경우 다른 일정 정보 표시 */}
                      {eventGroup.count > 1 && (
                        <div
                          className={`pt-1 border-t border-dashed ${colors.border[0]}`}>
                          <p className="font-p-500 text-sm text-gray-500">
                            동일한 일정이 {eventGroup.count}개 있습니다.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              className={`flex justify-center items-center h-full ${colors.text[1]} text-h5-lg font-p-500`}>
              해당 날짜에 일정이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 추가 모달 */}
      <CalendarEventAddModal
        isOpen={calendarEventAddModal.isOpen}
        close={calendarEventAddModal.close}
        showAlert={showAlert}
      />

      {/* 삭제 모달 */}
      <CalendarEventRemoveModal
        isOpen={calendarEventRemoveModal.isOpen}
        close={calendarEventRemoveModal.close}
        event={selectEvent}
        showAlert={showAlert}
      />

      {/* 수정 모달 */}
      <CalendarEventEditModal
        isOpen={calendarEventEditModal.isOpen}
        close={calendarEventEditModal.close}
        event={selectEvent}
        showAlert={showAlert}
      />

      {/* 앨범 연결 모달 */}
      {selectEvent && (
        <CalendarAlbumModal
          isOpen={calendarAlbumModal.isOpen}
          close={calendarAlbumModal.close}
          scheduleId={selectEvent.scheduleId}
          currentAlbumId={selectEvent.albumId || null}
          allAlbums={allAlbums}
          showAlert={showAlert}
        />
      )}
    </>
  );
}

export default CalendarEvent;
