import React, { useState } from 'react';
import apiClient from '@/apis/apiClient';
import axios from 'axios';

import need from '@/assets/images/Need.png';
import watchout from '@/assets/images/Watchout.png';

function Step1() {
  const [currentPage, setCurrentPage] = useState(0);

  // 준비물 아이템 더미 데이터(추후 교체 예정)
  const items = [
    {
      id: 1,
      image: need,
    },
    {
      id: 2,
      image: watchout,
    },
  ];

  const totalPages = items.length + 1;

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const handleDownloadPDF = async () => {
    try {
      // 1. API에서 presigned URL 가져오기
      const response = await apiClient.get('/api/fonts/template');
      console.log('응답 데이터:', response.data);

      if (response?.data?.presignedUrl) {
        // 2. presigned URL로 파일 다운로드 요청
        const downloadResponse = await axios({
          url: response.data.presignedUrl,
          method: 'GET',
          responseType: 'blob',
        });

        // 3. 파일 다운로드를 위한 임시 링크 생성
        const downloadUrl = window.URL.createObjectURL(
          new Blob([downloadResponse.data]),
        );
        const link = document.createElement('a');
        link.href = downloadUrl;

        // 4. 받은 fileName에서 실제 파일명만 추출
        // "template/fontTemplate.zip" -> "fontTemplate.zip"
        const fullPath = response.data.fileName;
        const actualFileName = fullPath.split('/').pop();

        link.setAttribute('download', actualFileName);

        document.body.appendChild(link);
        link.click();

        // 임시 요소 및 URL 정리
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        console.log('템플릿 다운로드 완료');
      } else {
        console.error('presigned URL이 응답에 포함되어 있지 않습니다.');
      }
    } catch (error) {
      console.error('템플릿 다운로드 중 오류 발생:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 flex-grow flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col items-center justify-center flex-grow">
          {currentPage === totalPages - 1 ? (
            <div className="flex flex-col items-center">
              <p className=" text-gray-800 text-center font-subtitle-2-lg">
                이제 템플릿을 다운로드하여 나만의 손글씨로 작성해 폰트를
                만들어보세요!
              </p>
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-blue-500 text-white rounded-md transition-colors text-subtitle-2-lg mt-4">
                템플릿 다운로드
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full h-full flex items-center justify-center">
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
