import React, { useState } from 'react';

function Step3() {
  const [fontNameKo, setFontNameKo] = useState('');
  const [fontNameEn, setFontNameEn] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('폰트 정보 제출:', { fontNameKo, fontNameEn });
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-md p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-h2-lg font-p-700 text-center mb-2">
            나의 폰트 만들기
          </h1>
          <p className="text-gray-600 text-center text-subtitle-1-lg">
            소중한 추억을 간직하는 공간 추억방울
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
          <div className="mb-6">
            <label
              htmlFor="fontNameKo"
              className="block mb-2 font-subtitle-1 text-subtitle-1-lg">
              폰트명(한글)
            </label>
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                id="fontNameKo"
                value={fontNameKo}
                onChange={(e) => setFontNameKo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className=''>체</p>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="fontNameEn"
              className="block mb-2 font-subtitle-1 text-subtitle-1-lg">
              폰트명(영어)
            </label>
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                id="fontNameEn"
                value={fontNameEn}
                onChange={(e) => setFontNameEn(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p>체</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md">
              제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Step3;
