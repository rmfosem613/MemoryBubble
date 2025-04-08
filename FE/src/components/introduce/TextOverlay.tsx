import React, { useState } from 'react';
import { useIsLoggedIn } from '@/hooks/useUserSatus';
interface TextOverlayProps {
  textContainerRef: React.RefObject<HTMLDivElement>;
}

const TextOverlay: React.FC<TextOverlayProps> = ({ textContainerRef }) => {
  // API 기본 URL 설정
  const API_BASE_URL = 'https://memorybubble.site';
  // const API_BASE_URL = 'http://localhost:8080';
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const kakaoLoginHandler = async () => {
    try {
      setIsLoading(true);
      // 바로 API_BASE_URL로 리다이렉트
      window.location.href = `${API_BASE_URL}/api/auth/login/kakao`;
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      // 오류 발생 시에도 전체 URL 사용
      window.location.href = `${API_BASE_URL}/api/auth/login/kakao`;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed bottom-12 left-20 z-30 select-none"
      ref={textContainerRef}>
      <div className="relative">
        {/* 기본 텍스트 (검은색) - 항상 보이는 텍스트 */}
        <p
          className="font-p-800 text-[75px]"
          style={{
            lineHeight: '90px',
            WebkitTextStroke: '1px black',
            color: 'black',
          }}>
          소중한 추억을 간직하는 공간, <br />
          추억방울과 함께하세요
        </p>

        {/* 클리핑 마스크로 작동할 이미지 영역 참조 요소 */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            clipPath: 'url(#textMask)',
            WebkitClipPath: 'url(#textMask)',
          }}>
          {/* 이미지와 겹치는 영역에만 보일 흰색 텍스트 */}
          <p
            className="font-p-800 text-[75px]"
            style={{
              lineHeight: '90px',
              WebkitTextStroke: '1px black',
              color: 'white',
            }}>
            소중한 추억을 간직하는 공간, <br />
            추억방울과 함께하세요
          </p>
        </div>
      </div>

      {/* 카카오 로그인 */}
      {!isLoggedIn && (
        <button
          className="w-52 mt-2"
          onClick={kakaoLoginHandler}
          disabled={isLoading}>
          <img src="/kakao_login1.png" alt="카카오 로그인" />
        </button>
      )}
    </div>
  );
};

export default TextOverlay;
