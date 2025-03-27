import axios from 'axios';
import apiClient from './apiClient';

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
  const createFamily = async (
    data: CreateFamilyRequest,
  ): Promise<CreateFamilyResponse> => {
    const response = await apiClient.post('/api/family', data);
    console.log('가족 생성(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 가족 초대코드 확인
  const verifyFamilyCode = async (
    data: VerifyFamilyCodeRequest,
  ): Promise<VerifyFamilyCodeResponse> => {
    const response = await apiClient.post('/api/family/code', data);
    console.log('초대코드 확인(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 가족 초대코드 발급
  const getFamilyInviteCode = async (
    familyId: number,
  ): Promise<GetInviteCodeResponse> => {
    const response = await apiClient.get(`/api/family/${familyId}/invite`);
    console.log('초대코드 발급(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 가족 정보 조회
  const fetchFamilyInfo = async (familyId: number): Promise<Family> => {
    const response = await apiClient.get(`/api/family/${familyId}`);
    console.log('가족 정보 조회(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 가족 정보 수정
  const updateFamilyInfo = async (
    familyId: number,
    data: UpdateFamilyRequest,
  ): Promise<UpdateWithImageResponse> => {
    const response = await apiClient.patch(`/api/family/${familyId}`, data);
    console.log('가족 정보 수정(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 유저 정보 등록 (가족 가입 후)
  const joinFamily = async (
    data: JoinFamilyRequest,
  ): Promise<JoinFamilyResponse> => {
    const response = await apiClient.post('/api/family/join', data);
    console.log('유저 정보 등록(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 현재 로그인한 사용자 조회
  const fetchCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get('/api/users/me');
    console.log('사용자 조회(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 사용자 프로필 조회
  const fetchUserProfile = async (userId: number): Promise<UserProfile> => {
    const response = await apiClient.get(`/api/users/${userId}`);
    console.log('프로필 조회(useUserApi.ts): ', response.data);
    return response.data;
  };

  // 사용자 프로필 수정
  const updateUserProfile = async (
    userId: number,
    data: UpdateUserProfileRequest,
  ): Promise<UpdateWithImageResponse> => {
    const response = await apiClient.patch(`/api/users/${userId}`, data);
    console.log('프로필 수정(useUserApi.ts): ', response.data);
    return response.data;
  };

  // presignedUrl로 이미지 업로드
  const uploadImageWithPresignedUrl = async (
    presignedUrl: string,
    file: File,
  ): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    console.log('이미지 업로드 완료');
  };

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

    // 유틸리티
    uploadImageWithPresignedUrl,
  };
};

export default useUserApi;
