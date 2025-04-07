import React from 'react';
import useFontStore from '@/stores/useFontStore';

function Step3() {
  const {
    fontNameKo,
    setFontNameKo,
    submitFont,
    isSubmitting,
    submitError,
    uploadedFiles,
  } = useFontStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFont();
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
              폰트명(7글자 이내)
            </label>
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                id="fontNameKo"
                value={fontNameKo}
                onChange={(e) => {
                  if (e.target.value.length <= 7) {
                    setFontNameKo(e.target.value);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="">체</p>
              <span
                className={`text-xs ${fontNameKo.length >= 7 ? 'text-red-500' : 'text-gray-500'}`}>
                {fontNameKo.length}/7
              </span>
            </div>
          </div>

          {/* 업로드된 파일 수량 표시 */}
          <div className="mb-6 bg-gray-50 rounded-md p-3">
            <p className="text-gray-700">
              업로드된 파일:{' '}
              <span className="font-bold">{uploadedFiles.length}개</span>
            </p>
            {uploadedFiles.length !== 8 && (
              <p className="text-red-500 mt-1 text-sm">
                8개 파일을 업로드해야 폰트를 생성할 수 있습니다.
              </p>
            )}
          </div>

          {/* 에러 메시지 표시 */}
          {submitError && (
            <p className="text-red-500 mt-1 text-sm">{submitError}</p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting || uploadedFiles.length !== 8}
              className={`w-full py-3 rounded-md ${
                isSubmitting || uploadedFiles.length !== 8
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}>
              {isSubmitting ? '제출 중...' : '제출하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Step3;
