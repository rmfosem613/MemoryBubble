import { useState } from 'react';
// API 기본 URL 설정
const API_BASE_URL = 'https://memorybubble.site';
// const API_BASE_URL = 'http://localhost:8080';

function TestKakaoLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const kakaoLoginHandler = async () => {
    try {
      setIsLoading(true);
      // 바로 API_BASE_URL로 리다이렉트
      window.location.href = `${API_BASE_URL}/api/auth/login`;
      // 카카오 로그인 API 호출
      // const response = await axios.get(`${API_BASE_URL}/api/auth/login`);
      // const response = await axios.get(
      //   `https://memorybubble.site/api/auth/login`,
      // );
      // if (response.data && response.data.redirectUrl) {
      //   // 카카오 인증 페이지로 리다이렉트
      //   window.location.href = response.data.redirectUrl;
      // }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      // 오류 발생 시에도 전체 URL 사용
      window.location.href = `${API_BASE_URL}/api/auth/login`;
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
