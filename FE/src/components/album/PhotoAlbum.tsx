import Title from '../common/Title';
import PostCardTemplate from './common/PostcardTemplate';
import {
  PencilLine,
  ImageUp,
  ChevronLeft,
  ChevronRight,
  FolderUp,
  Mic,
  CirclePause,
  CirclePlay,
  CirclePlus,
} from 'lucide-react';
import { usePhotoAlbum } from '@/hooks/usePhotoAlbum';
import DropDown from '../common/Modal/DropDown';
import { usePhotoMessages } from '@/hooks/usePhotoMessages ';
import Modal from '../common/Modal/Modal';
import useModal from '@/hooks/useModal';
import apiClient from '@/apis/apiClient';
import { useAlert } from '@/hooks/useAlert';
import PhotoUploader from '../photo/PhotoUploader';
import Alert from '../common/Alert';

// 폰트 스타일을 생성하는 컴포넌트
const FontStyles = ({ fontInfoList }) => {
  return (
    <style>
      {fontInfoList.map((font) => {
        if (font.status === 'DONE' && font.fileName) {
          return `
            @font-face {
              font-family: '${font.fontName}';
              src: url('${font.fileName}') format('truetype');
              font-weight: normal;
              font-style: normal;
            }
            .font-user-${font.userId} {
              font-family: '${font.fontName}', sans-serif;
            }
          `;
        }
        return '';
      })}
    </style>
  );
};

function PhotoAlbum() {
  const {
    albumTitle,
    newAlbumName,
    setNewAlbumName,
    albumContent,
    newAlbumContent,
    setNewAlbumContent,
    isFlipped,
    toggleFlipWithPostCard,
    toggleFlip,
    photos,
    isLoading,
    currentIndex,
    photoMessages, // API에서 가져온 메시지 데이터0
    setPhotoMessages, // 메시지 데이터 업데이트 함수
    handleChangeAlbum,
    handleChangeThumnail,
    getPrevIndex,
    getNextIndex,
    goToPrevious,
    goToNext,
    allAlbums,
    setTargetAlbumId,
    handleMovePhoto,
    albumId,
    refreshPhotos,
    fontInfoList,
  } = usePhotoAlbum();

  const {
    postcardMessage,
    setPostcardMessage,
    isRecording,
    currentlyPlayingId,
    messageInputRef,
    handleSaveMessage,
    handleRecordButtonClick,
    toggleAudioPlayback,
  } = usePhotoMessages(photos, currentIndex);

  const { alertState, showAlert } = useAlert();

  // 각 모달별로 useModal() 훅 사용하여 상태 관리
  const editAlbumModal = useModal();
  const changeThumbnailModal = useModal();
  const movePhotoModal = useModal();
  const addPhotoModal = useModal();

  const handleGoToPrevious = () => {
    goToPrevious();
    setPostcardMessage(''); // 메시지 입력란 초기화
  };

  const handleGoToNext = () => {
    goToNext();
    setPostcardMessage(''); // 메시지 입력란 초기화
  };

  // 녹음 버튼 핸들러 래핑 함수
  const handleRecordButtonWrapper = async () => {
    const wasRecording = isRecording;

    handleRecordButtonClick();

    if (wasRecording) {
      setTimeout(async () => {
        if (photos && photos.length > 0) {
          try {
            const currentPhotoId = photos[currentIndex].id;
            const response = await apiClient.get(
              `/api/photos/${currentPhotoId}`,
            );
            if (response.data && Array.isArray(response.data)) {
              setPhotoMessages(response.data);
            }
          } catch (error) {
            console.error('메시지 목록 업데이트 실패:', error);
          }
        }
      }, 1000);
    }
  };

  // API에서 가져온 메시지 렌더링 함수
  const renderApiMessage = (message) => {
    // 메시지 작성자의 폰트 정보 찾기
    const userFont = fontInfoList.find(
      (font) => font.userId === message.writerId,
    );

    // 폰트 클래스 이름 생성 (해당 폰트가 있을 경우만)
    const fontClass =
      userFont && userFont.status === 'DONE'
        ? `font-user-${userFont.userId}`
        : '';

    if (message.type === 'TEXT') {
      return (
        <div key={message.id || message.createdAt} className="mb-2">
          <div className="flex items-center gap-2">
            <h4 className={`font-p-700 text-h3-lg ${fontClass}`}>
              {message.writer || '사용자'}
            </h4>
          </div>
          <p
            className={`text-gray-700 mt-1 text-h4-lg font-p-500 ${fontClass}`}>
            {message.content}
          </p>
        </div>
      );
    } else if (message.type === 'AUDIO') {
      const isPlaying = currentlyPlayingId === (message.id || message.content);

      return (
        <div
          key={message.id || message.createdAt}
          className="flex flex-row mb-2 ">
          <div className="flex items-center justify-center gap-2">
            <h4 className={`font-p-700 text-h3-lg ${fontClass}`}>
              {message.writer || '사용자'}
            </h4>
          </div>
          <div className="mt-2">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // URL을 직접 전달하고 isDirectUrl을 true로 설정
                  toggleAudioPlayback(message.content, true);
                }}
                className="p-2 bg-blue-100 rounded-full">
                {isPlaying ? (
                  <CirclePause size={24} />
                ) : (
                  <CirclePlay size={24} />
                )}
                <div className="absolute bg-blue-600 w-5 h-5 rounded-full right-[6px] bottom-[6px] opacity-50"></div>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  // 메시지 저장 함수 (기존 handleSaveMessage 함수 호출 후 메시지 목록 갱신)
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 기존 handleSaveMessage 함수 호출
    await handleSaveMessage(e);

    // API에서 최신 메시지 목록 다시 가져오기 - toggleFlipWithPostCard 함수의 로직 활용
    if (photos && photos.length > 0) {
      try {
        const currentPhotoId = photos[currentIndex].id;
        const response = await apiClient.get(`/api/photos/${currentPhotoId}`);
        if (response.data && Array.isArray(response.data)) {
          setPhotoMessages(response.data);
        } else {
          setPhotoMessages([]);
        }
      } catch (error) {
        console.error('메시지 목록 업데이트 실패:', error);
      }
    }
  };

  // 앨범 선택 핸들러
  const handleSelectAlbum = (albumId) => {
    setTargetAlbumId(albumId);
  };

  // 비동기 함수를 Modal의 onConfirm 속성에 맞는 래퍼 함수로 변환
  const handleChangeAlbumWrapper = () => {
    handleChangeAlbum();
    showAlert('앨범 정보가 수정되었습니다.', 'green');
    return true; // 모달 닫기
  };

  const handleChangeThumnailWrapper = () => {
    handleChangeThumnail();
    showAlert('썸네일이 변경되었습니다.', 'green');
    return true; // 모달 닫기
  };

  const handleMovePhotoWrapper = () => {
    handleMovePhoto();
    setPostcardMessage('');
    showAlert('사진이 이동되었습니다.', 'green');
    return true; // 모달 닫기
  };

  if (isLoading) {
    return <div className="text-center p-8">사진을 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-baseline mb-6">
        <div className="flex flex-row items-end">
          <Title text={albumTitle} />
          <div className="text-subtitle-1-lg text-gray-600">
            사진을 눌러 엽서를 작성해보세요
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors relative"
            onClick={editAlbumModal.open}>
            <div className="absolute bg-gray-600 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <PencilLine size={18} strokeWidth={1} />
            <p className="text-subtitle-1-lg">앨범 정보 수정</p>
          </div>
          <div
            className={`relative flex items-center gap-1 ${
              photos[currentIndex].isThumbnail
                ? 'text-gray-400 cursor-not-allowed'
                : 'cursor-pointer hover:text-blue-500 transition-colors'
            }`}
            onClick={
              photos[currentIndex].isThumbnail
                ? undefined
                : changeThumbnailModal.open
            }
            aria-disabled={photos[currentIndex].isThumbnail}>
            <div className="absolute bg-blue-400 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <ImageUp size={18} strokeWidth={1} />
            <p className="text-subtitle-1-lg">썸네일 변경</p>
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors relative"
            onClick={addPhotoModal.open}>
            <div className="absolute bg-album-200 w-4 h-4 rounded-full left-1 top-2 opacity-50"></div>
            <CirclePlus size={18} strokeWidth={1} />
            <p className="text-subtitle-1-lg">사진 추가하기</p>
          </div>
        </div>
      </div>

      {/* 이미지 슬라이더 - 더 큰 컨테이너로 변경 */}
      <div className="relative h-screen max-h-[500px] overflow-hidden my-8">
        <div className="flex justify-center items-center h-full">
          {/* 이전 이미지 (왼쪽에 약간 보이는 이미지) */}
          {photos.length > 1 && (
            <div className="bg-white absolute left-24 h-full flex items-center opacity-70 transform -translate-x-1/4 scale-90 z-10">
              <img
                src={photos[getPrevIndex()].src}
                alt={photos[getPrevIndex()].alt}
                className="h-4/5 max-h-[450px] w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={handleGoToPrevious}
              />
            </div>
          )}

          {/* 현재 이미지 (가운데 큰 이미지) - 3D 뒤집기 효과 추가 */}
          <div
            className="relative z-20 perspective-1000 cursor-pointer"
            style={{ perspective: '1000px' }}>
            <div
              className="bg-white border relative transition-transform duration-700 transform-style-preserve-3d w-[700px] h-[500px] flex items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s',
              }}>
              {/* 앞면 - 사진 */}
              {photos && photos.length > 0 ? (
                <img
                  src={photos[currentIndex].src + '&w=800'}
                  alt={photos[currentIndex].alt}
                  className="max-w-full max-h-full object-contain absolute"
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                  onClick={toggleFlipWithPostCard}
                />
              ) : (
                <p className="text-subtitle-1-lg font-p-500 text-gray-500 mb-4">
                  사진이 없습니다.
                </p>
              )}

              {/* 뒷면 - 엽서 형태 */}
              <div
                className="absolute w-full h-full inset-0 bg-white p-4  flex flex-col justify-between"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}>
                <FontStyles fontInfoList={fontInfoList} />
                {/* 상단 버튼 영역 */}
                <div className="flex justify-end gap-2">
                  <div className="flex gap-2">
                    <button
                      className="flex p-1 hover:text-blue-500 gap-1"
                      onClick={movePhotoModal.open}>
                      <FolderUp size={20} strokeWidth={1} />
                      앨범 이동하기
                    </button>
                    <p
                      onClick={toggleFlip}
                      className="flex px-4 text-gray-600 items-center justify-end cursor-pointer hover:text-blue-500 transition-colors">
                      사진으로 가기
                    </p>
                  </div>
                </div>

                {/* 메시지 표시 영역 - API에서 가져온 메시지 표시 */}
                <div className="flex-1 overflow-y-auto px-2 mt-2 z-10">
                  {photoMessages && photoMessages.length > 0 ? (
                    photoMessages.map((message) => renderApiMessage(message))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      이 사진에 남겨진 메시지가 없습니다.
                    </p>
                  )}
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
                      onChange={(e) => {
                        // 40자 이내로 제한
                        if (e.target.value.length <= 40) {
                          setPostcardMessage(e.target.value);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleMessageSubmit(e);
                        }
                      }}
                      disabled={isRecording}
                    />
                    <div
                      className={`absolute bottom-2 right-3 text-xs ${postcardMessage.length >= 40 ? 'text-red-500' : 'text-gray-500'}`}>
                      {postcardMessage.length}/40
                    </div>
                  </div>
                  <button
                    className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors z-10"
                    onClick={handleMessageSubmit}
                    disabled={isRecording || !postcardMessage.trim()}>
                    글 남기기
                  </button>
                  <button
                    className={`${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white text-black hover:bg-gray-100 border'
                    } h-full px-4 py-2 rounded-lg transition-colors z-10`}
                    onClick={handleRecordButtonWrapper}>
                    <Mic size={20} strokeWidth={1} />
                  </button>
                  {isRecording && (
                    <span className="animate-pulse text-red-500 ml-2">
                      녹음중...
                    </span>
                  )}
                </div>
                {/* 엽서 템플릿 */}
                <PostCardTemplate />
              </div>
            </div>
          </div>

          {/* 다음 이미지 (오른쪽에 약간 보이는 이미지) */}
          {photos.length > 1 && (
            <div className="bg-white absolute right-24 h-full flex items-center opacity-70 transform translate-x-1/4 scale-90 z-10">
              <img
                src={photos[getNextIndex()].src}
                alt={photos[getNextIndex()].alt}
                className="h-4/5 max-h-[450px] w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={handleGoToNext}
              />
            </div>
          )}
        </div>
      </div>

      {/* 페이지 인디케이터 */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-6">
          <button onClick={handleGoToPrevious}>
            <ChevronLeft size={20} />
          </button>
          <p className="text-sm text-gray-600">
            {currentIndex + 1} / {photos.length}
          </p>
          <button onClick={handleGoToNext}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* 앨범명 수정 모달 */}
      <Modal
        isOpen={editAlbumModal.isOpen}
        onClose={editAlbumModal.close}
        title="앨범 정보 수정"
        confirmButtonText="저장하기"
        cancelButtonText="취소하기"
        onConfirm={handleChangeAlbumWrapper}>
        <div>
          <p className="text-subtitle-1-lg font-p-500">
            앨범명과 내용을 수정해주세요 (최대 7글자)
          </p>
          <form className="py-4">
            <label
              htmlFor="albumName"
              className="block mb-2 text-subtitle-1-lg font-p-700 text-black">
              앨범명
            </label>
            <input
              type="text"
              id="albumName"
              value={newAlbumName}
              onChange={(e) => {
                if (e.target.value.length <= 7) {
                  setNewAlbumName(e.target.value);
                }
              }}
              placeholder={albumTitle}
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${newAlbumName.length >= 7 ? 'text-red-500' : 'text-gray-500'}`}>
                {newAlbumName.length}/7
              </span>
            </div>

            <label
              htmlFor="albumContent"
              className="block mb-2 mt-2 text-subtitle-1-lg font-p-700 text-black">
              앨범 내용
            </label>
            <input
              type="text"
              id="albumContent"
              value={newAlbumContent}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setNewAlbumContent(e.target.value);
                }
              }}
              placeholder={albumContent}
              className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${newAlbumContent.length >= 60 ? 'text-red-500' : 'text-gray-500'}`}>
                {newAlbumContent.length}/60
              </span>
            </div>
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
        onConfirm={handleChangeThumnailWrapper}>
        <div className="py-2">
          <p className="mb-4">썸네일로 등록할 사진을 확인해주세요</p>
          <div className="w-full flex justify-center">
            {photos && photos.length > 0 && currentIndex < photos.length ? (
              <img
                src={photos[currentIndex].src}
                alt="Selected thumbnail"
                className="h-64 object-cover"
              />
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">사진이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* 앨범 이동 모달 */}
      <Modal
        isOpen={movePhotoModal.isOpen}
        onClose={movePhotoModal.close}
        title="앨범 이동하기"
        confirmButtonText="이동하기"
        cancelButtonText="취소하기"
        onConfirm={handleMovePhotoWrapper}>
        <div className="py-2">
          <p className="mb-4">이동할 앨범을 선택해주세요.</p>
          <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">
            앨범 선택하기
          </p>
          <DropDown
            albums={allAlbums}
            currentAlbumId={parseInt(albumId)} // useParams()로 가져온 현재 앨범 ID
            onSelectAlbum={handleSelectAlbum}
            placeholder="앨범을 선택해주세요"
          />
        </div>
      </Modal>

      {/* 사진 추가 모달 */}
      <PhotoUploader
        isOpen={addPhotoModal.isOpen}
        onClose={addPhotoModal.close}
        albumId={parseInt(albumId)}
        onUploadComplete={refreshPhotos}
      />

      {alertState && (
        <Alert message={alertState.message} color={alertState.color} />
      )}
    </div>
  );
}

export default PhotoAlbum;
