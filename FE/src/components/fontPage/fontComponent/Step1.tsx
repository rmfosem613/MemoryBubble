import React, { useState } from 'react';
import test1 from '@/assets/images/test1.png';
import test2 from '@/assets/images/test2.png';
import test3 from '@/assets/images/test3.png';

function Step1() {
  const [currentPage, setCurrentPage] = useState(0);

  // 준비물 아이템 더미 데이터(추후 교체 예정)
  const items = [
    {
      id: 1,
      image: test1,
    },
    {
      id: 2,
      image: test2,
    },
    {
      id: 3,
      image: test3,
    },
  ];

  const totalPages = items.length + 1;

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const handleDownloadPDF = () => {
    console.log('PDF가 다운로드 되었습니다.');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 flex-grow flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col items-center justify-center flex-grow">
          {currentPage === totalPages - 1 ? (
            <div className="flex flex-col items-center">
              <p className=" text-gray-800 text-center font-subtitle-2-lg">
                이제 템플릿을 다운로드 받아주세요!
                <br />
                나만의 손글씨로 템플릿을 작성하여 폰트를 만들어보세요.
              </p> 
              <button
                onClick={handleDownloadPDF}
                className="px-8 py-3 bg-blue-500 text-white rounded-md transition-colors text-lg mt-4">
                템플릿 다운로드
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 mb-4 flex items-center justify-center">
                <img
                  src={items[currentPage].image}
                  alt="image"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={goToPrevPage}
            className="flex items-center justify-center text-blue-500 hover:text-blue-700 mr-6"
            aria-label="이전 페이지">
            <span className="text-2xl">&lt;</span>
          </button>

          <div className="text-gray-700">
            {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            className="flex items-center justify-center text-blue-500 hover:text-blue-700 ml-6"
            aria-label="다음 페이지">
            <span className="text-2xl">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step1;
