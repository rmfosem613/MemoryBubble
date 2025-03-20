import Title from '../common/Title';
import { PencilLine, ImageUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePhotoAlbum } from '@/hooks/usePhotoAlbum';
import { useModal } from '@/hooks/useModal';

function PhotoAlbum() {
  const {
    currentAlbum,
    photos,
    isLoading,
    currentIndex,
    handleChangeTitle,
    handleChangeThumnail,
    getPrevIndex,
    getNextIndex,
    goToPrevious,
    goToNext,
  } = usePhotoAlbum();

  const { openModal } = useModal();

  if (isLoading) {
    return <div className="text-center p-8">사진을 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-baseline mb-6">
        <Title text={currentAlbum?.title || '앨범'} />
        <div className="flex justify-end gap-4">
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors relative"
            onClick={() =>
              openModal({
                title: '앨범 명 수정',
                content: (
                  <div>
                    <p>앨범 명을 수정해주세요</p>
                    <form className="py-4">
                      <label
                        htmlFor="album_name"
                        className="block mb-2 text-sm font-medium text-black dark:text-white">
                        앨범 명
                      </label>
                      <input
                        type="text"
                        id="album_name"
                        className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </form>
                  </div>
                ),
                confirmButtonText: '저장하기',
                cancelButtonText: '취소하기',
                onConfirmClick: handleChangeTitle,
              })
            }>
            <div className="absolute bg-gray-600 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <PencilLine size={18} />
            <p className="text-sm">앨범 명 수정</p>
          </div>
          <div
            className="relative flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() =>
              openModal({
                title: '썸네일 변경',
                content: (
                  <div className="py-2">
                    {/* 선택한 이미지 보이기 */}
                    <p className="mb-4">썸네일로 등록할 사진을 확인해주세요</p>
                    <div className="w-full flex justify-center">
                      <img
                        src={photos[currentIndex].src}
                        alt="Selected thumbnail"
                        className="h-64 object-cover"
                      />
                    </div>
                  </div>
                ),
                confirmButtonText: '저장하기',
                cancelButtonText: '취소하기',
                onConfirmClick: handleChangeThumnail,
              })
            }>
            <div className="absolute bg-blue-400 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <ImageUp size={18} />
            <p className="text-sm">썸네일 변경</p>
          </div>
        </div>
      </div>

      {/* 이미지 슬라이더 - 더 큰 컨테이너로 변경 */}
      <div className="relative h-screen max-h-[500px] overflow-hidden my-8">
        <div className="flex justify-center items-center h-full">
          {/* 이전 이미지 (왼쪽에 약간 보이는 이미지) */}
          {photos.length > 1 && (
            <div className="absolute left-24 h-full flex items-center opacity-70 transform -translate-x-1/4 scale-90 z-10">
              <img
                src={photos[getPrevIndex()].src}
                alt={photos[getPrevIndex()].alt}
                className="h-4/5 max-h-[450px] w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={goToPrevious}
              />
            </div>
          )}

          {/* 현재 이미지 (가운데 큰 이미지) */}
          <div className="relative z-20">
            <img
              src={photos[currentIndex].src}
              alt={photos[currentIndex].alt}
              className="h-auto max-h-[500px] w-auto max-w-2xl object-contain transition-all duration-300"
            />
          </div>

          {/* 다음 이미지 (오른쪽에 약간 보이는 이미지) */}
          {photos.length > 1 && (
            <div className="absolute right-24 h-full flex items-center opacity-70 transform translate-x-1/4 scale-90 z-10">
              <img
                src={photos[getNextIndex()].src}
                alt={photos[getNextIndex()].alt}
                className="h-4/5 max-h-[450px] w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={goToNext}
              />
            </div>
          )}
        </div>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={goToPrevious}>
          <ChevronLeft size={20} />
        </button>
        <p className="text-sm text-gray-600">
          {currentIndex + 1} / {photos.length}
        </p>
        <button onClick={goToNext}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default PhotoAlbum;
