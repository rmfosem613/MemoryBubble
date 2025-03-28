import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useUserStore } from '@/stores/useUserStroe'
import useUserStore from '@/stores/useUserStore';
import apiClient from '@/apis/apiClient';

// API 기본 URL 설정
import axios from 'axios';
const API_BASE_URL = 'https://memorybubble.site';

function TestKakaoLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (accessToken && user) {
  //     navigate('/');
  //   }
  // }, [navigate, user]);
  useEffect(() => {
    const checkLogin = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // 토큰이 유효한지 확인하기 위해 사용자 데이터 가져오기
          const response = await apiClient.get('/api/users/me');
          // const response = await axios.get(`${API_BASE_URL}/api/users/me`)

          // const userData = response.data
          const { userId, familyId } = response.data;

          // 사용자 프로필 받아오기
          const userDetailsResponse = await apiClient.get(
            `/api/users/${userId}`,
          );
          const userDetails = userDetailsResponse.data;

          // 전역 상태 관리
          setUser({
            userId,
            familyId,
            ...userDetails,
          });
          console.log('TESTKAKAOLOGIN' + userId + ' , ' + familyId);

          // 사용자가 이미 로그인되어 있다면 페이지 이동
          if (familyId) {
            navigate('/'); // 메인 페이지로 이동
          } else {
            navigate('/enter'); // 추가 정보 입력 페이지로 이동
          }
        } catch (error) {
          // 토큰이 유효하지 않으면 저장된 토큰 삭제
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          console.log('유효하지 않은 토큰이므로 삭제됨');
        }
      }
    };

    checkLogin();
  }, [navigate, setUser]);

  const kakaoLoginHandler = async () => {
    try {
      setIsLoading(true);
      // 카카오 로그인 API 호출
      // console.log(API_BASE_URL)

      // const response = await apiClient.get('/api/users/me');
      const response = await axios.get(`${API_BASE_URL}/api/auth/login`);

      if (response.data && response.data.redirectUrl) {
        // 카카오 인증 페이지로 리다이렉트
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      // 오류 발생 시에도 전체 URL 사용
      // window.location.href = `${API_BASE_URL}/api/auth/login`
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        className="border border-gray-700 p-3 px-6 rounded-[8px] bg-gray-400 text-black"
        onClick={kakaoLoginHandler}
        disabled={isLoading}>
        {isLoading ? '로그인 중...' : '카카오 로그인 테스트'}
      </button>
    </div>
  );
}

export default TestKakaoLogin;
