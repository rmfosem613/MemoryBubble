import React, { useEffect, useRef, useState } from 'react';
import '@/components/introduce/scrollAnimation.css';

// 분리된 컴포넌트들 임포트 - 파일명 수정
// 수정된 빠른 스크롤링 배경 컴포넌트 임포트
import ScrollingBackground from '@/components/introduce/ScrollingBackground';
import ClipingView from '@/components/introduce/ClipingView';
import TextOverlay from '@/components/introduce/TextOverlay';
import NewSection from '@/components/introduce/NewSection';

function IntroducePage() {
  const [curtainHeight, setCurtainHeight] = useState(1000);
  const [telescopeSize, setTelescopeSize] = useState(1000);
  const [isFullyScrolled, setIsFullyScrolled] = useState(false);
  const [newSectionPosition, setNewSectionPosition] = useState('100%'); // 새로운 섹션 위치 관리
  
  const [backgroundOpacity, setBackgroundOpacity] = useState(1); // 배경 투명도 상태 추가
  const [logoOpacity, setLogoOpacity] = useState(0); // 로고 투명도 상태 추가
  const [logoScale, setLogoScale] = useState(0.5); // 로고 크기 상태 추가

  const textContainerRef = useRef(null);
  const imageAreaRef = useRef(null);
  const scrollContentRef = useRef(null);
  const nextSectionRef = useRef(null);
  const logoRef = useRef(null);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      // 첫 번째 스크롤 단계: 망원경 크기 조절 (더 빠르게 확대되도록 조정)
      const firstPhaseMaxScroll = document.body.scrollHeight * 0.3; // 0.7에서 0.5로 변경하여 더 빨리 망원경이 확대되도록 함
      const scrollY = window.scrollY;
      const scrollRatio = Math.min(scrollY / firstPhaseMaxScroll, 1);

      // 최대 화면의 150%까지만 커지도록 제한 (200%에서 150%로 변경)
      const maxSize = Math.max(window.innerWidth, window.innerHeight) * 1.2;
      const newSize = 1000 + scrollRatio * (maxSize - 1000);

      // 망원경 크기 업데이트 - 더 빠르게 확대되도록 수정
      setTelescopeSize(Math.min(newSize, maxSize));

      // 완전히 스크롤됐는지 확인 (망원경이 전체 화면을 덮는지)
      if (newSize >= maxSize * 1) { // 0.9에서 0.8로 변경하여 더 일찍 전환되도록 함
        setIsFullyScrolled(true);

        // 새로운 섹션의 위치 계산 - 스크롤 비율에 따라 올라오도록
        const secondPhaseRatio = (scrollY - firstPhaseMaxScroll) / (firstPhaseMaxScroll * 0.2); // 0.3에서 0.2로 변경
        const limitedRatio = Math.max(0, Math.min(1, secondPhaseRatio));
        const newPosition = 100 - (limitedRatio * 100); // 100%에서 0%로 변경 (아래서 위로 올라옴)
        setNewSectionPosition(`${newPosition}%`);
      } else {
        setIsFullyScrolled(false);
        setNewSectionPosition('100%'); // 충분히 스크롤되지 않았을 때는 항상 아래에 위치
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 커튼 애니메이션 효과 - 현재 코드에서 누락됨
  useEffect(() => {
    // 페이지가 로드되면 약간의 지연 후 커튼을 아래로 사라지게 함
    const timer = setTimeout(() => {
      // 애니메이션 효과를 위해 점진적으로 커튼 높이를 줄임
      const animateCurtain = () => {
        setCurtainHeight(prev => {
          if (prev <= 0) return 0;
          return prev - 30; // 줄여나감
        });
      };

      const animation = setInterval(animateCurtain, 10); // 10ms마다 실행

      // 애니메이션이 완료되면 interval 정리
      const cleanup = setTimeout(() => {
        clearInterval(animation);
      }, 1000); // 대략 1.2초 정도 소요

      return () => {
        clearInterval(animation);
        clearTimeout(cleanup);
      };
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        ref={logoRef}
        className='fixed top-0 left-0 w-full h-screen flex justify-center items-center z-50 pointer-events-none'
        style={{
          opacity: logoOpacity,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          transform: `scale(${logoScale})`,
        }}
      >
        <img className='w-[500px]' src="/logo-1.svg" alt="Logo" />
      </div>

      <div style={{ height: '450vh' }}>
        {/* 스크롤을 위한 충분한 높이 제공 - 짧게 수정된 스크롤 높이 */}
        <div className='relative' style={{ height: '90vh' }}>
          {/* 배경 이미지 - 고정 위치 */}
          <div className='flex h-screen bg-gray-800 fixed top-0 -left-[130px] w-[110%]'>
            {/* 전체 화면을 덮는 오버레이 - 하얀색 배경 */}
            <div className='fixed top-0 left-0 w-full h-screen z-10'></div>

            {/* 이미지 그리드 배경 - 무한 스크롤 애니메이션 */}
            <ScrollingBackground />

            {/* 망원경 뷰와 클리핑 마스크 */}
            <ClipingView
              telescopeSize={telescopeSize}
              imageAreaRef={imageAreaRef}
              textContainerRef={textContainerRef}
            />

            {/* 텍스트 오버레이 */}
            <TextOverlay textContainerRef={textContainerRef} />
          </div>

          {/* 검은색 커튼 - 위에서 아래로 사라짐 (z-index를 높이고 fixed로 변경하여 헤더보다 앞에 배치) */}
          <div
            className='fixed top-0 left-0 right-0 bg-black z-[999] transition-height ease-out'
            style={{
              height: `${curtainHeight}%`,
              transition: 'height 0.5s ease-out'
            }}
          ></div>


        </div>
        {/* 새로운 섹션 - 아래에서 올라오는 흰색 배경 섹션 (z-index 수정하여 보이도록) */}
        <NewSection
          newSectionPosition={newSectionPosition}
          nextSectionRef={nextSectionRef}
        />
      </div>
    </>
  );
}

export default IntroducePage;