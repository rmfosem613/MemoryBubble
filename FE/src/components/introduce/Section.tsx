import React, { useEffect, useRef } from 'react';
import { BookHeart, Edit3, Calendar, Image, Mail } from 'lucide-react';
import FontPageCarousel from './FontPageCarousel';

const Section = () => {
  // 스크롤 애니메이션을 위한 요소 참조
  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    handwriting: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    calendar: useRef<HTMLDivElement>(null),
    letter: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    // Intersection Observer 설정
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 요소가 화면에 들어오면 애니메이션 클래스 추가
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0');
            entry.target.classList.remove('translate-y-10');
          } else {
            // 요소가 화면에서 벗어나면 애니메이션 클래스 제거
            entry.target.classList.remove('animate-fade-in');
            entry.target.classList.remove('opacity-100');
            entry.target.classList.add('opacity-0');
            entry.target.classList.add('translate-y-10');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3, // 10% 정도 보이면 애니메이션 시작
      },
    );

    // 모든 섹션 요소에 Observer 등록
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // 컴포넌트 언마운트 시 Observer 해제
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-winter-000">
      {/* 두 번째 섹션: 나만의 손글씨 */}
      <section
        ref={sectionRefs.handwriting}
        className="min-h-screen flex items-start justify-center py-10 opacity-0 translate-y-10 transition-all duration-1000 bg-autumn-000">
        <div className="container flex flex-col gap- items-center mb-4">
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <h2 className="flex items-center">
              <Edit3 size={33} className="mr-2 text-blue-600" />
              <p className="text-3xl font-extrabold">나만의 손글씨</p>
            </h2>
            <p className="text-gray-700 font-p-500">
              나만의 손글씨를 디지털 폰트로 만들어보세요!
            </p>
          </div>
          {/* 내용 */}
          <FontPageCarousel />
        </div>
      </section>

      {/* 세 번째 섹션: 추억 갤러리 */}
      <section
        ref={sectionRefs.gallery}
        className="flex flex-col items-center justify-center py-20 opacity-0 translate-y-10 transition-all duration-1000 bg-winter-000">
        <div className="container flex flex-col md:flex-row-reverse gap-6 md:gap-8 items-center">
          <div className="flex flex-col gap-5 ">
            <h2 className="flex items-center pt-5">
              <Image size={33} className="mr-2 text-blue-600" />
              <p className="text-3xl font-extrabold">추억 갤러리</p>
            </h2>
            <div className="text-gray-700 flex flex-col gap-3 font-p-500">
              <p>
                추억이 담긴 사진들로
                <br />
                나만의 특별한 앨범을 만들어보세요.
              </p>
              <p>
                사진 뒷면의 엽서에 텍스트나 음성으로
                <br />그 순간의 이야기를 남길 수 있어요.
              </p>
              <p>
                소중한 기억들이 더 의미 있게 보관되고
                <br />
                가족과 함께 공유됩니다.
              </p>
            </div>
          </div>
          <div className="flex-1 w-[90%] md:w-full">
            <img
              src="intro-postcard.gif"
              alt="갤러리"
              className="rounded-lg shadow-md select-none"
            />
          </div>
        </div>
      </section>

      {/* 네 번째 섹션: 방울 캘린더 */}
      <section
        ref={sectionRefs.calendar}
        className="flex min-h-screen flex-col items-center justify-center py-20 opacity-0 translate-y-10 transition-all duration-1000 bg-summer-000">
        <div className="container flex flex-col lg:flex-row items-center lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 mb-6 lg:mb-0">
            <h2 className="flex items-centerd">
              <Calendar size={33} className="mr-2 text-blue-600" />
              <p className="text-3xl font-extrabold">방울 캘린더</p>
            </h2>
            <div className="text-gray-700 flex flex-col gap-3 font-p-500">
              <p>가족 모두의 일정을 한눈에 공유할 수 있어요.</p>
              <p>
                생일, 기념일, 가족 행사 등을 함께 기록하고
                <br />
                특별한 날의 앨범을 연결하여
                <br /> 소중한 추억을 일정과 함께 간직할 수 있습니다.
              </p>
            </div>
            <div className="flex space-x-5">
              <div className="flex flex-col items-center">
                <div className="bg-winter-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-winter.svg"
                    alt="겨울 캘린더"
                    className="h-40 select-none"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-spring-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-spring.svg"
                    alt="봄 캘린더"
                    className="h-40 select-none"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-summer-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-summer.svg"
                    alt="여름 캘린더"
                    className="h-40 select-none"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-autumn-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-autumn.svg"
                    alt="가을 캘린더"
                    className="h-40 select-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/introCalendar.png"
              alt="전체 캘린더"
              className="rounded-lg shadow-md w-[390px] lg:w-[90%] select-none"
            />
          </div>
        </div>
      </section>

      {/* 다섯 번째 섹션: 편지 */}
      <section
        ref={sectionRefs.letter}
        className="min-h-screen flex flex-col items-center justify-center py-20 opacity-0 translate-y-10 transition-all duration-1000 bg-winter-000">
        <div className="container flex flex-col md:flex-row-reverse md:justify-between items-center">
          <div className="flex flex-col gap-5">
            <h2 className="flex items-center ">
              <Mail size={33} className="mr-2 text-blue-600" />
              <p className="text-3xl font-extrabold">편지</p>
            </h2>
            <div className="text-gray-700 mb-4 flex flex-col gap-3 font-p-500">
              <p>
                가족에게 진심을 담은 특별한 편지를 전해보세요.
                <br />
                느린편지로 원하는 개봉 날짜를 지정할 수 있습니다.
              </p>
              <p>
                지정된 날짜가 되어야만 편지를 열어볼 수 있어,
                <br />
                생일이나 특별한 기념일에 깜짝 선물처럼 전달됩니다.
              </p>

              <p>
                시간을 넘어 전하는 따뜻한 마음으로
                <br />
                가족과의 소중한 추억을 만들어보세요.
              </p>
            </div>
          </div>
          <div className="flex-1 relative flex md:self-start">
            <img
              src="intro-cassetteWinter.svg"
              alt="카세트 테이프"
              className="ml-28 rounded-[16px] mt-4 w-[40%] md:m-0 md:w-[80%] lg:w-[60%] shadow-lg -rotate-6 select-none"
            />
            <img
              src="/intro-unLetterWinter.svg"
              alt="편지 봉투"
              className="z-10 absolute top-20 left-44 w-[45%] md:top-24 md:left-14 md:w-[80%] lg:left-36 lg:top-24 lg:w-[60%] shadow-lg select-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section;
