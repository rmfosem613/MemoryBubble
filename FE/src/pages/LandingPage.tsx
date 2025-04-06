import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface LoadingPageProps {
  message?: string;
  redirectTo?: string;
  duration?: number;
}

const LandingPage: React.FC<LoadingPageProps> = ({
  message = '추억방울',
  redirectTo = '/introduce',
  duration = 2000, // 로딩 시간 (밀리초)
}) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);
  const [showCurtain, setShowCurtain] = useState<boolean>(false);

  useEffect(() => {
    // 로딩 진행 상태를 업데이트하는 함수
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;

        // 100%에 도달하면 interval 정리 및 커튼 표시
        if (newProgress >= 100) {
          clearInterval(interval);
          setShowCurtain(true);
          
          // 커튼 애니메이션 후 리다이렉션
          setTimeout(() => {
            navigate(redirectTo);
          }, 1000); // 커튼 애니메이션에 충분한 시간 부여
          
          return 100;
        }

        return newProgress;
      });
    }, duration / 100); // 전체 로딩 시간을 100등분하여 진행

    // 클린업 함수
    return () => {
      clearInterval(interval);
    };
  }, [navigate, redirectTo, duration]);

  return (
    <>
      <div className='justify-end pt-[60px] relative h-screen overflow-hidden'>
        {/* 검은색 커튼 */}
        <div 
          className='absolute inset-0 bg-black z-50 transition-transform duration-800 ease-in-out'
          style={{ 
            transform: showCurtain ? 'translateY(0)' : 'translateY(100%)',
          }}
        ></div>

        <div className='flex-col w-full h-full'>
          <div className='flex-col -bottom-[152px] -left-[46px] mt-auto fixed inset-0 flex align-bottom justify-end '>
            <p
              className="font-p-800 text-[429px] mt-[100px]"
              style={{
                letterSpacing: "0px",
                WebkitTextStroke: '2px black',
                backgroundImage: `linear-gradient(to right, black ${progress}%, white ${progress}%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                transition: 'background-image 0.3s ease-out'
              }}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage