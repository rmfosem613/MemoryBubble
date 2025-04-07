import React, { useEffect, useRef } from 'react';
import { BookHeart, Edit3, Calendar, Image, Mail } from 'lucide-react';

const IntroPage = () => {
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
        threshold: 0.2, // 10% 정도 보이면 애니메이션 시작
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
    <div className="min-h-screen bg-white pt[65px]">
      {/* 두 번째 섹션: 나만의 손글씨 */}
      <section
        ref={sectionRefs.handwriting}
        className="min-h-screen flex flex-col items-center justify-center pb-10 opacity-0 translate-y-10 transition-all duration-1000 bg-summer-100">
        {/* <div className="max-w-4xl mx-auto px-4"> */}
        <div className="container flex flex-col gap-12 items-center">
          <div className="flex justify-between gap-7">
            <div className="flex-1">
              <h2 className="text-4xl font-extrabold mb-4 flex items-center pt-4">
                <Edit3 size={35} className="mr-2 text-blue-500" />
                <p>나만의 손글씨</p>
              </h2>
              <p className="">
                당신의 고유한 손글씨로 다양한 폰트로 만들어보세요.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-[60%] select-none">
              <img
                src="/intro-fontTemplate.png"
                alt="손글씨 템플릿"
                className="rounded-lg shadow-md"
              />
              <img
                src="/intro-fontTemplate2.png"
                alt="손글씨 템플릿 작성"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="flex justify-between gap-7">
            <img
              src="/intro-fontRequest.png"
              alt="폰트 체험 페이지"
              className="w-[70%] shadow-md rounded-lg object-cover select-none"
            />

            <p>
              손글씨 폰트를 활용하여 더 기록을 특별하게 만들 수 있습니다.
              <br />
              <br />
              당신만의 일기처럼 모든 디자인 요소에 개인의 감성을 더해보세요.
            </p>
          </div>
        </div>
        {/* </div> */}
      </section>

      {/* 세 번째 섹션: 추억 갤러리 */}
      <section
        ref={sectionRefs.gallery}
        className="flex flex-col items-center justify-center py-20 opacity-0 translate-y-10 transition-all duration-1000 bg-white">
        <div className="container flex flex-col md:flex-row-reverse gap-6 md:gap-8 items-center ">
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
          <div className="flex-1">
            <img
              src="intro-postcard.gif"
              alt="갤러리"
              className="rounded-lg shadow-md w-[60%] md:w-full"
            />
          </div>
        </div>
      </section>

      {/* 네 번째 섹션: 방울 캘린더 */}
      <section
        ref={sectionRefs.calendar}
        className="flex flex-col items-center justify-center py-20 opacity-0 translate-y-10 transition-all duration-1000">
        <div className="container flex flex-col md:flex-row items-center md:items-end md:justify-between">
          <div className="flex flex-col gap-5 mb-6 md:mb-0">
            <h2 className="flex items-center pt-5">
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
                    className="h-40"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-spring-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-spring.svg"
                    alt="봄 캘린더"
                    className="h-40"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-summer-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-summer.svg"
                    alt="여름 캘린더"
                    className="h-40"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-autumn-100 p-2 rounded-b-lg shadow-md">
                  <img
                    src="/calendar-autumn.svg"
                    alt="가을 캘린더"
                    className="h-40"
                  />
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/introCalendar.png"
              alt="전체 캘린더"
              className="rounded-lg shadow-md w-[340px] md:w-[90%]"
            />
          </div>
        </div>
      </section>

      {/* 다섯 번째 섹션: 편지 */}
      <section
        ref={sectionRefs.letter}
        className="flex flex-col items-center justify-center py-20 opacity-0 translate-y-10 transition-all duration-1000">
        <div className="container flex flex-col md:flex-row-reverse md:justify-between items-center pt-10">
          <div className="flex flex-col gap-5">
            <h2 className="flex items-center lg:pt-6">
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
              className="ml-28 mt-4 w-[40%] md:m-0 md:w-[80%] lg:w-[60%] shadow-lg -rotate-6"
            />
            <img
              src="/intro-unLetterWinter.svg"
              alt="편지 봉투"
              className="z-10 absolute top-20 left-44 w-[45%] md:top-24 md:left-14 md:w-[80%] lg:left-36 lg:top-24 lg:w-[60%] shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
