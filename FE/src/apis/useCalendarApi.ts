import { AxiosResponse } from 'axios';
import apiClient from './apiClient';

// 일정 타입 정의
export interface Schedule {
  scheduleId: number;
  scheduleContent: string;
  startDate: string;
  endDate: string;
  albumId: number;
}

// 일정 조회 요청 파라미터 타입
export interface FetchSchedulesParams {
  family_id: number;
  year: number;
  month: number;
}

// 일정 추가/수정 요청 타입
export interface ScheduleRequest {
  familyId: number;
  startDate: string;
  endDate: string;
  content: string;
  albumId?: number;
}

// 앨범 연결 요청 타입
export interface LinkAlbumRequest {
  albumId: number;
}

// 일정 목록 조회
export const fetchSchedules = async (
  params: FetchSchedulesParams,
): Promise<AxiosResponse<Schedule[]>> => {
  try {
    const response = await apiClient.get<Schedule[]>('/api/schedules', {
      params,
    });
    console.log('일정 목록 조회 성공:', response.data);
    return response;
  } catch (error) {
    console.error('일정 목록 조회 실패:', error);
    throw error;
  }
};

// 일정 추가
export const createSchedule = async (
  data: ScheduleRequest,
): Promise<AxiosResponse<Schedule>> => {
  try {
    const response = await apiClient.post<Schedule>('/api/schedules', data);
    console.log('일정 추가 성공:', response.data);
    return response;
  } catch (error) {
    console.error('일정 추가 실패:', error);
    throw error;
  }
};

// 앨범 연결
export const linkAlbumToSchedule = async (
  scheduleId: number,
  data: LinkAlbumRequest,
): Promise<AxiosResponse<Schedule>> => {
  try {
    const response = await apiClient.post<Schedule>(
      `/api/schedules/${scheduleId}/link`,
      data,
    );
    console.log('앨범 연결 성공:', response.data);
    return response;
  } catch (error) {
    console.error('앨범 연결 실패:', error);
    throw error;
  }
};

// 일정 수정
export const updateSchedule = async (
  scheduleId: number,
  data: ScheduleRequest,
): Promise<AxiosResponse<Schedule>> => {
  try {
    const response = await apiClient.patch<Schedule>(
      `/api/schedules/${scheduleId}`,
      data,
    );
    console.log('일정 수정 성공:', response.data);
    return response;
  } catch (error) {
    console.error('일정 수정 실패:', error);
    throw error;
  }
};

// 일정 삭제
export const deleteSchedule = async (
  scheduleId: number,
): Promise<AxiosResponse<void>> => {
  try {
    const response = await apiClient.delete<void>(
      `/api/schedules/${scheduleId}`,
    );
    console.log('일정 삭제 성공');
    return response;
  } catch (error) {
    console.error('일정 삭제 실패:', error);
    throw error;
  }
};
