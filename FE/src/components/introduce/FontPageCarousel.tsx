import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FontPageCarousel = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3;

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // 페이지 콘텐츠
  const pages = [
    <div key="page1" className="flex flex-col gap-3 w-full pl-[110px] mt-[10px]">
      <p className="text-gray-700 flex flex-col gap-2 font-p-500 w-[380px] md:w-[65%]">
        <span><span className='font-bold'>Step 1.</span> 템플릿 다운로드</span>
        : 제공된 양식에 맞춰 나의 손글씨를 작성해주세요
      </p>
      <div className="grid grid-cols-2 gap-5 select-none h-[410px] w-full md:w-[65%] ml-[80px]">
        <div className="w-full h-full">
          <img
            src="/intro-fontTemplate.png"
            alt="손글씨 템플릿"
            className="w-full h-full bg-white object-contain rounded-lg shadow-md"
          />
        </div>
        <div className="w-full h-full">
          <img
            src="/intro-fontTemplate2.png"
            alt="손글씨 템플릿 작성"
            className="w-[92%] h-full bg-white overflow-hidden object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>,
    <div key="page2" className="flex flex-col gap-2 w-full pl-[110px] mt-[10px]">
      <p className="text-gray-700 flex flex-col gap-3 font-p-500 w-[400px] md:w-[80%]">
        <span><span className='font-bold'>Step 2.</span> 작성한 파일 업로드</span>
        : 완성된 템플릿을 업로드하여 폰트 제작을 의뢰하세요
      </p>
      <div className="select-none h-[410px] md:w-[80%]">
        <img
          src="/intro-fontRequest.png"
          alt="폰트 페이지"
          className="h-full shadow-md rounded-lg object-cover select-none"
        />
      </div>
    </div>,
    <div key="page3" className="flex flex-col gap-2 w-full pl-[110px] mt-[10px]">
      <p className="text-gray-700 flex flex-col gap-3 font-p-500  md:w-[80%]">
        <span><span className='font-bold'>Step 3.</span> 나의 폰트 확인</span>
        : 생성된 폰트를 확인하고 사용해보세요!
      </p>
      <div className="select-none h-[410px] md:w-[80%]">
        <img
          src="/intro-fontPage.png"
          alt="폰트 페이지"
          className="h-full shadow-md rounded-lg object-cover select-none"
        />
      </div>
    </div>,
  ];

  const displayedPage = pages[currentPage];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 페이지 콘텐츠 */}
      <div className="w-full mb-4">{displayedPage}</div>

      {/* 페이지 넘김 UI 및 인디케이터 */}
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`p-2 rounded-full ${currentPage === 0
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-autumn-100'
            }`}
          aria-label="이전 페이지">
          <ChevronLeft size={24} />
        </button>

        {/* 페이지 인디케이터 (동그라미) */}
        <div className="flex space-x-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentPage
                ? 'bg-autumn-200'
                : 'bg-autumn-100 hover:bg-autumn-200/50'
                }`}
              aria-label={`${index + 1}번 페이지로 이동`}
            />
          ))}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={`p-2 rounded-full ${currentPage === totalPages - 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-autumn-100'
            }`}
          aria-label="다음 페이지">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FontPageCarousel;
