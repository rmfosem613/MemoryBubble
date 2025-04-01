import { AxiosResponse } from 'axios';
import apiClient from './apiClient';
import { useCallback } from 'react';

// 일정 타입 정의
interface Schedule {
  scheduleId: number;
  scheduleContent: string;
  startDate: string;
  endDate: string;
  albumId: number;
}

// 일정 조회 요청 파라미터 타입
interface FetchSchedulesParams {
  family_id: number;
  year: number;
  month: number;
}

// 일정 추가/수정 요청 타입
interface ScheduleRequest {
  familyId: number;
  startDate: string;
  endDate: string;
  content: string;
  albumId?: number;
}

// 앨범 연결 요청 타입
interface LinkAlbumRequest {
  albumId: number;
}

export const useCalendarApi = () => {
  // 일정 목록 조회
  const fetchSchedules = useCallback(
    async (
      params: FetchSchedulesParams,
    ): Promise<AxiosResponse<Schedule[]>> => {
      const response = await apiClient.get<Schedule[]>('/api/schedules', {
        params,
      });
      return response;
    },
    [],
  );

  // 일정 추가
  const createSchedule = useCallback(
    async (data: ScheduleRequest): Promise<AxiosResponse<Schedule>> => {
      const response = await apiClient.post<Schedule>('/api/schedules', data);
      return response;
    },
    [],
  );

  // 앨범 연결
  const linkAlbumToSchedule = useCallback(
    async (
      scheduleId: number,
      data: LinkAlbumRequest,
    ): Promise<AxiosResponse<Schedule>> => {
      const response = await apiClient.post<Schedule>(
        `/api/schedules/${scheduleId}/link`,
        data,
      );
      return response;
    },
    [],
  );

  // 일정 수정
  const updateSchedule = useCallback(
    async (
      scheduleId: number,
      data: ScheduleRequest,
    ): Promise<AxiosResponse<Schedule>> => {
      const response = await apiClient.patch<Schedule>(
        `/api/schedules/${scheduleId}`,
        data,
      );
      return response;
    },
    [],
  );

  // 일정 삭제
  const deleteSchedule = useCallback(
    async (scheduleId: number): Promise<AxiosResponse<{}>> => {
      const response = await apiClient.delete<{}>(
        `/api/schedules/${scheduleId}`,
      );
      return response;
    },
    [],
  );

  return {
    fetchSchedules,
    createSchedule,
    linkAlbumToSchedule,
    updateSchedule,
    deleteSchedule,
  };
};

export default useCalendarApi;
