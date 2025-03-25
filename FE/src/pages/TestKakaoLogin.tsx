import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStroe';
import apiClient from '@/apis/apiClient';

function TestKakaoLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && user) {
      navigate('/');
    }
  }, [navigate, user]);

  const kakaoLoginHandler = async () => {
    try {
      setIsLoading(true);
      // 카카오 로그인 API 호출 (전체 URL 대신 경로만 사용)
      const response = await apiClient.get("/api/auth/login");

      if (response.data && response.data.redirectUrl) {
        // 카카오 인증 페이지로 리다이렉트
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      // 오류 발생 시 직접 리다이렉트 (전체 URL 대신 경로만 사용)
      window.location.href = "/api/auth/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <button
        className='border border-gray-700 p-3 px-6 rounded-[8px] bg-gray-400 text-black'
        onClick={kakaoLoginHandler}
        disabled={isLoading}
      >
        {isLoading ? '로그인 중...' : '카카오 로그인 테스트'}
      </button>
    </div>
  );
}

export default TestKakaoLogin;