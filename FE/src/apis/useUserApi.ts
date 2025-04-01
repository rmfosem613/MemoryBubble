import axios, { AxiosResponse } from 'axios';
import apiClient from './apiClient';
import { useCallback } from 'react';

// 가족 생성 요청 타입
interface CreateFamilyRequest {
  familyName: string;
}

// 가족 생성 응답 타입
interface CreateFamilyResponse {
  familyId: number;
  presignedUrl: string;
  fileName: string;
}

// 가족 초대코드 확인 요청 타입
interface VerifyFamilyCodeRequest {
  code: string;
}

// 가족 초대코드 확인 응답 타입
interface VerifyFamilyCodeResponse {
  familyId: number;
}

// 가족 초대코드 발급 응답 타입
interface GetInviteCodeResponse {
  code: string;
}

// 가족 구성원 타입 정의
interface FamilyMember {
  userId: number;
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
}

// 가족 정보 타입 정의
interface Family {
  familyName: string;
  thumbnailUrl: string;
  familyMembers: FamilyMember[];
}

// 가족 정보 수정 요청 타입
interface UpdateFamilyRequest {
  familyName: string;
}

// 유저 정보 등록 요청 타입
interface JoinFamilyRequest {
  familyId: number;
  birth: string;
  name: string;
  phoneNumber: string;
  gender: 'M' | 'F';
}

// 유저 정보 등록 응답 타입
interface JoinFamilyResponse {
  presignedUrl: string;
  fileName: string;
}

// 사용자 타입 정의
interface User {
  userId: number;
  familyId: number | null;
}

// 프로필 타입 정의
interface UserProfile {
  name: string | null;
  profileUrl: string | null;
  birth: string | null;
  phoneNumber: string | null;
  gender: 'M' | 'F' | null;
  familyId: number | null;
}

// 사용자 프로필 수정 요청 타입
interface UpdateUserProfileRequest {
  birth?: string;
  gender?: 'M' | 'F';
  name?: string;
  phoneNumber?: string;
}

// 프로필/가족 수정 응답 타입 (이미지 업로드용)
interface UpdateWithImageResponse {
  presignedUrl: string;
  fileName: string;
}

export const useUserApi = () => {
  // 가족 생성
  const createFamily = useCallback(
    async (
      data: CreateFamilyRequest,
    ): Promise<AxiosResponse<CreateFamilyResponse>> => {
      const response = await apiClient.post<CreateFamilyResponse>(
        '/api/family',
        data,
      );
      return response;
    },
    [],
  );

  // 가족 초대코드 확인
  const verifyFamilyCode = useCallback(
    async (
      data: VerifyFamilyCodeRequest,
    ): Promise<AxiosResponse<VerifyFamilyCodeResponse>> => {
      const response = await apiClient.post<VerifyFamilyCodeResponse>(
        '/api/family/code',
        data,
      );
      return response;
    },
    [],
  );

  // 가족 초대코드 발급
  const getFamilyInviteCode = useCallback(
    async (familyId: number): Promise<AxiosResponse<GetInviteCodeResponse>> => {
      const response = await apiClient.get<GetInviteCodeResponse>(
        `/api/family/${familyId}/invite`,
      );
      return response;
    },
    [],
  );

  // 가족 정보 조회
  const fetchFamilyInfo = useCallback(
    async (familyId: number): Promise<AxiosResponse<Family>> => {
      const response = await apiClient.get<Family>(`/api/family/${familyId}`);
      return response;
    },
    [],
  );

  // 가족 정보 수정
  const updateFamilyInfo = useCallback(
    async (
      familyId: number,
      data: UpdateFamilyRequest,
    ): Promise<AxiosResponse<UpdateWithImageResponse>> => {
      const response = await apiClient.patch<UpdateWithImageResponse>(
        `/api/family/${familyId}`,
        data,
      );
      return response;
    },
    [],
  );

  // 유저 정보 등록 (가족 가입 후)
  const joinFamily = useCallback(
    async (
      data: JoinFamilyRequest,
    ): Promise<AxiosResponse<JoinFamilyResponse>> => {
      const response = await apiClient.post<JoinFamilyResponse>(
        '/api/family/join',
        data,
      );
      return response;
    },
    [],
  );

  // 현재 로그인한 사용자 조회
  const fetchCurrentUser = useCallback(async (): Promise<
    AxiosResponse<User>
  > => {
    const response = await apiClient.get<User>('/api/users/me');
    return response;
  }, []);

  // 사용자 프로필 조회
  const fetchUserProfile = useCallback(
    async (userId: number): Promise<AxiosResponse<UserProfile>> => {
      const response = await apiClient.get<UserProfile>(`/api/users/${userId}`);
      return response;
    },
    [],
  );

  // 사용자 프로필 수정
  const updateUserProfile = useCallback(
    async (
      userId: number,
      data: UpdateUserProfileRequest,
    ): Promise<AxiosResponse<UpdateWithImageResponse>> => {
      const response = await apiClient.patch<UpdateWithImageResponse>(
        `/api/users/${userId}`,
        data,
      );
      return response;
    },
    [],
  );

  // 로그아웃
  const logout = useCallback(async (): Promise<AxiosResponse> => {
    const response = await apiClient.get('/api/auth/logout');
    return response;
  }, []);

  // presignedUrl로 이미지, 카세트 업로드
  const uploadImageWithPresignedUrl = useCallback(
    async (presignedUrl: string, file: File): Promise<AxiosResponse<void>> => {
      const response = await axios.put<void>(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return response;
    },
    [],
  );

  return {
    // 가족 관련 API
    createFamily,
    verifyFamilyCode,
    getFamilyInviteCode,
    fetchFamilyInfo,
    updateFamilyInfo,

    // 사용자 관련 API
    joinFamily,
    fetchCurrentUser,
    fetchUserProfile,
    updateUserProfile,
    logout,

    // 유틸리티
    uploadImageWithPresignedUrl,
  };
};

export default useUserApi;
