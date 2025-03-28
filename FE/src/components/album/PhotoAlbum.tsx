import Title from '../common/Title';
import PostCardTemplate from './common/PostcardTemplate';
import {
  PencilLine,
  ImageUp,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FolderUp,
  Mic,
  CirclePlay,
  CirclePause,
} from 'lucide-react';
import { usePhotoAlbum } from '@/hooks/usePhotoAlbum';
import DropDown from '../common/Modal/DropDown';
import { usePhotoMessages } from '@/hooks/usePhotoMessages ';
import Modal from '../common/Modal/Modal';
import useModal from '@/hooks/useModal';

function PhotoAlbum() {
  const {
    postcardMessage,
    setPostcardMessage,
    isRecording,
    messageInputRef,
    handleSaveMessage,
    toggleAudioPlayback,
    handleRecordButtonClick,
    sortedMessages,
  } = usePhotoMessages();

  const {
    isFlipped,
    toggleFlip,
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

  // 각 모달별로 useModal() 훅 사용하여 상태 관리
  const editAlbumModal = useModal();
  const changeThumbnailModal = useModal();
  const deletePhotoModal = useModal();
  const movePhotoModal = useModal();

  if (isLoading) {
    return <div className="text-center p-8">사진을 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-baseline mb-6">
        <Title text={currentAlbum.title} />
        <div className="flex justify-end gap-4">
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors relative"
            onClick={editAlbumModal.open}>
            <div className="absolute bg-gray-600 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <PencilLine size={18} />
            <p className="text-subtitle-1-lg">앨범명 수정</p>
          </div>
          <div
            className="relative flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors"
            onClick={changeThumbnailModal.open}>
            <div className="absolute bg-blue-400 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <ImageUp size={18} />
            <p className="text-subtitle-1-lg">썸네일 변경</p>
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

          {/* 현재 이미지 (가운데 큰 이미지) - 3D 뒤집기 효과 추가 */}
          <div
            className="relative z-20 perspective-1000 cursor-pointer"
            style={{ perspective: '1000px' }}>
            <div
              className="relative transition-transform duration-700 transform-style-preserve-3d w-[700px] h-[500px]"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s',
              }}>
              {/* 앞면 - 사진 */}
              <img
                src={photos[currentIndex].src}
                alt={photos[currentIndex].alt}
                className="w-full h-full object-cover absolute backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  position: 'relative',
                }}
                onClick={toggleFlip}
              />

              {/* 뒷면 - 엽서 형태 */}
              <div
                className="absolute w-full h-full inset-0 bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}>
                {/* 상단 버튼 영역 */}
                <div className="flex justify-end gap-2">
                  <div className="flex gap-2">
                    <button
                      className="flex p-1 hover:text-blue-500 gap-1"
                      onClick={deletePhotoModal.open}>
                      <Trash2 size={20} />
                      삭제하기
                    </button>
                    <button
                      className="flex p-1 hover:text-blue-500 gap-1"
                      onClick={movePhotoModal.open}>
                      <FolderUp size={20} />
                      앨범 이동하기
                    </button>
                    <p
                      onClick={toggleFlip}
                      className="flex px-4 text-gray-600 items-center justify-end cursor-pointer hover:text-blue-500 transition-colors">
                      사진으로 가기
                    </p>
                  </div>
                </div>

                {/* 메시지 표시 영역 - 통합된 메시지 목록 */}
                <div className="flex-1 overflow-y-auto px-2 mt-2 z-10">
                  {sortedMessages.map((message) => (
                    <div key={message.id} className="mb-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <h4 className="font-p-700 text-h4-lg">
                          현재 유저 이름
                        </h4>

                        <div>
                          {message.type === 'audio' ? (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAudioPlayback(message.id);
                                }}
                                className="p-2 bg-blue-100 rounded-full ">
                                {message.isPlaying ? (
                                  <CirclePause size={24} />
                                ) : (
                                  <CirclePlay size={24} />
                                )}
                                <div className="absolute bg-blue-600 w-5 h-5 rounded-full right-[6px] bottom-[6px] opacity-50"></div>
                              </button>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

                      {message.type === 'text' && (
                        <p className="text-gray-700 mt-1 text-subtitle-1-lg font-p-500">
                          {message.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* 하단 입력 영역 - 이벤트 버블링 방지 적용 */}
                <div
                  className="mt-4 flex items-end gap-2"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex-1 relative">
                    <input
                      ref={messageInputRef}
                      type="text"
                      className="w-full p-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="공유할 수 있는 추억의 글귀를 추가해보세요."
                      value={postcardMessage}
                      onChange={(e) => setPostcardMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors z-10"
                    onClick={handleSaveMessage}>
                    글 남기기
                  </button>
                  {!isRecording ? (
                    <button
                      className="bg-white text-black h-full px-4 py-2 rounded-lg border z-10 hover:bg-gray-100 transition-colors"
                      onClick={handleRecordButtonClick}>
                      <Mic size={20} />
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 text-white h-full px-4 py-2 rounded-lg border hover:bg-red-600 transition-colors z-10"
                      onClick={handleRecordButtonClick}>
                      <Mic size={20} />
                    </button>
                  )}
                </div>
                {/* 엽서 템플릿 */}
                <PostCardTemplate />
              </div>
            </div>
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

      {/* 앨범명 수정 모달 */}
      <Modal
        isOpen={editAlbumModal.isOpen}
        onClose={editAlbumModal.close}
        title="앨범명 수정"
        confirmButtonText="저장하기"
        cancelButtonText="취소하기"
        onConfirm={handleChangeTitle}>
        <div>
          <p className="text-subtitle-1-lg font-p-500">앨범명을 수정해주세요</p>
          <form className="py-4">
            <label
              htmlFor="album_name"
              className="block mb-2 text-subtitle-1-lg font-p-700 text-black dark:text-white">
              앨범명
            </label>
            <input
              type="text"
              id="album_name"
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </form>
        </div>
      </Modal>

      {/* 썸네일 변경 모달 */}
      <Modal
        isOpen={changeThumbnailModal.isOpen}
        onClose={changeThumbnailModal.close}
        title="썸네일 변경"
        confirmButtonText="저장하기"
        cancelButtonText="취소하기"
        onConfirm={handleChangeThumnail}>
        <div className="py-2">
          <p className="mb-4">썸네일로 등록할 사진을 확인해주세요</p>
          <div className="w-full flex justify-center">
            <img
              src={photos[currentIndex].src}
              alt="Selected thumbnail"
              className="h-64 object-cover"
            />
          </div>
        </div>
      </Modal>

      {/* 사진 삭제 모달 */}
      <Modal
        isOpen={deletePhotoModal.isOpen}
        onClose={deletePhotoModal.close}
        title="사진 삭제하기"
        confirmButtonText="삭제하기"
        cancelButtonText="취소하기">
        <div className="py-2">
          <p className="mb-4">사진을 삭제하시겠습니까?</p>
        </div>
      </Modal>

      {/* 앨범 이동 모달 */}
      <Modal
        isOpen={movePhotoModal.isOpen}
        onClose={movePhotoModal.close}
        title="앨범 이동하기"
        confirmButtonText="이동하기"
        cancelButtonText="취소하기">
        <div className="py-2">
          <p className="mb-4">이동할 앨범을 선택해주세요.</p>
          <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">
            앨범 선택하기
          </p>
          {/* 이거 살려야 함 */}
          {/* <DropDown /> */}
          <div className="h-[130px]"></div>
        </div>
      </Modal>
    </div>
  );
}

export default PhotoAlbum;
