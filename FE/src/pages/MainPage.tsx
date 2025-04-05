import { useEffect, useState } from "react";
import SlidingAlbumList from "@/components/album/SlidingAlbumList";
import useAlbumStore from "@/stores/useAlbumStore";
import { useNavigate, useLocation } from 'react-router-dom';
import useModal from "@/hooks/useModal";
import Loading from "./LoadingPage";
import useUserStore from "@/stores/useUserStore";

// 분리된 컴포넌트들 임포트
import PhotoUploader from "@/components/photo/PhotoUploader";
import AlbumCreator from "@/components/album/AlbumCreator";
import DropDown from "@/components/common/Modal/DropDown";

// 기본 앨범 이미지 불러오기
import defaultAlbumImage from "@/assets/album/blank.svg";
import Alert from "@/components/common/Alert";

function MainPage() {
  const { currentAlbum, fetchAlbumsData, albums, isLoading, error, setActiveIndex } = useAlbumStore();
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const location = useLocation();

  // 앨범 선택 상태 관리
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 모달 관련
  const createAlbumModal = useModal();
  const addPhotoModal = useModal();

  // 컴포넌트 마운트 시 앨범 데이터 가져오기
  useEffect(() => {
    fetchAlbumsData();
  }, [fetchAlbumsData]);

  // 앨범 로드 후 초기 선택 앨범 설정
  useEffect(() => {
    if (currentAlbum && currentAlbum.id) {
      setSelectedAlbumId(currentAlbum.id);
    }
  }, [currentAlbum]);

  // 페이지 접근 시 항상 첫 번째 앨범으로 초기화
  useEffect(() => {
    if (albums.length > 0) {
      // 항상 첫 번째 앨범(index 0)으로 설정
      setActiveIndex(0);
    }
  }, [albums, setActiveIndex, location.pathname]);

  // 앨범 클릭 시 해당 앨범 상세 페이지로 이동
  const handleAlbumClick = () => {
    if (!currentAlbum) return;

    // 앨범 리스트의 인덱스 확인
    const { activeIndex } = useAlbumStore.getState();

    // 첫 번째 앨범(인덱스 0)인 경우 BasicPhotoAlbumPage로, 그 외에는 PhotoAlbumPage로 이동
    if (activeIndex === 0) {
      navigate('/album/basic');
    } else {
      navigate(`/album/${currentAlbum.id}`);
    }
  };

  // 앨범 이미지 URL 체크 함수
  const getAlbumImageUrl = (url?: string) => {
    // URL이 비어있거나 presigned URL 문자열이 포함된 경우 기본 이미지 반환
    if (!url || url.includes('presigned')) {
      return defaultAlbumImage;
    }
    return url;
  };

  // 앨범 선택 핸들러
  const handleAlbumSelect = (albumId: number) => {
    setSelectedAlbumId(albumId);
  };

  // 앨범 생성 완료 핸들러
  const handleAlbumCreated = async () => {
    await fetchAlbumsData();
    showAlertMessage("앨범이 생성되었습니다.", "green");
  };

  // 사진 업로드 완료 핸들러
  const handlePhotosUploaded = async () => {
    await fetchAlbumsData();
    showAlertMessage("사진이 업로드되었습니다.", "green");
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <Loading message="Now Loading..." />
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-subtitle-1-lg font-p-500 text-red-500">{error}</p>
        <button
          onClick={() => fetchAlbumsData()}
          className="mt-4 px-4 py-2 bg-p-800 text-white rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 앨범이 없는 경우
  if (!currentAlbum) {
    return (
      <div className="h-screen flex items-center justify-center bg-white flex-col">
        <p className="text-subtitle-1-lg font-p-500">앨범이 없습니다.</p>
        <button
          onClick={createAlbumModal.open}
          className="mt-4 px-4 py-2 bg-p-800 text-white rounded-md"
        >
          앨범 생성하기
        </button>

        {/* 앨범 생성 컴포넌트 */}
        <AlbumCreator
          isOpen={createAlbumModal.isOpen}
          onClose={createAlbumModal.close}
          familyId={user.familyId || 0}
          onCreateComplete={handleAlbumCreated}
        />
      </div>
    );
  }

  // 앨범 이미지 URL 확인
  const albumImageUrl = getAlbumImageUrl(currentAlbum.imageUrl);

  // 앨범 선택 컴포넌트 - 사진 업로더에 전달할 컴포넌트
  const AlbumSelector = (
    <div className="relative w-full mb-4">
      <p className="mb-1 text-subtitle-1-lg font-p-500 text-black">앨범 선택하기</p>
      <DropDown
        albums={albums.map(album => ({ id: album.id, title: album.title }))}
        currentAlbumId={selectedAlbumId}
        onSelectAlbum={handleAlbumSelect}
        placeholder="앨범을 선택해주세요"
      />
    </div>
  );

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}

      <div className="flex justify-center">
        <div className="container flex justify-end top-[100px] absolute">
          {/* 앨범 리스트 컴포넌트 */}
          <SlidingAlbumList />
          <div className="fixed z-50 w-[360px] p-4 bottom-[8px] grid grid-cols-2 gap-4">
            <button
              onClick={createAlbumModal.open}
              className="flex cursor-pointer justify-center bg-white pt-[14px] pb-[14px] rounded-[8px] shadow-md">
              <p className="text-subtitle-1-lg font-p-500">앨범 생성</p>
            </button>
            <button
              onClick={addPhotoModal.open}
              className="flex cursor-pointer justify-center bg-white pt-[14px] pb-[14px] rounded-[8px] shadow-md">
              <p className="text-subtitle-1-lg font-p-500">사진 추가</p>
            </button>
          </div>
        </div>
      </div>
      <div
        className="h-screen transition-colors duration-500 overflow-hidden scrollbar-hide"
        style={{ backgroundColor: currentAlbum.bgColor || '#FFFFFF' }}
      >
        <div className="flex w-[90%] ml-0 z-0 relative">
          {/* 영역1 */}
          <div className="flex-[80] h-screen text-white text-center pt-[65px] justyfi-center item-center relative flex overflow-hidden">
            {/* 앨범 이미지 영역 */}
            <div className="flex mb-auto w-full overflow-hidden">

              {/* 앨범 제목 */}
              <div
                className="absolute z-10 w-full transition-colors duration-500"
                style={{ backgroundColor: currentAlbum.bgColor || '#FFFFFF' }}
              >
                <div className='relative h-[180px] w-full overflow-hidden bg-transparent text-left z-10'>
                  {albumImageUrl === defaultAlbumImage ? (
                    // 기본 이미지일 때는 검은색 텍스트로 표시
                    <p className='absolute text-album-1-lg font-p-800 w-[94%] text-gray-200
                      drop-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]'>
                      {currentAlbum.title}
                    </p>
                  ) : (
                    // 커스텀 이미지일 때는 기존 스타일 유지
                    <p
                      className='absolute text-album-1-lg font-p-800 bg-clip-text w-[94%]
                      drop-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]'
                      style={{
                        color: "transparent",
                        WebkitBackgroundClip: "text",
                        backgroundImage: `url('${albumImageUrl}')`,
                        backgroundSize: "100%"
                      }}>
                      {currentAlbum.title || "추억보관함"}
                    </p>
                  )}
                </div>
              </div>

              {/* 앨범 이미지 - 클릭 이벤트 추가 */}
              <img
                src={albumImageUrl}
                className='w-[94%] object-cover cursor-pointer'
                onClick={handleAlbumClick}
                alt={currentAlbum.title}
              />
            </div>
          </div>

          {/* 영역2 - 앨범 리스트 뒤에 보이지 않는 영역 */}
          <div className="flex-[30]" />

        </div>
      </div>


      {/* 앨범 생성 컴포넌트 */}
      <AlbumCreator
        isOpen={createAlbumModal.isOpen}
        onClose={createAlbumModal.close}
        familyId={user.familyId || 0}
        onCreateComplete={handleAlbumCreated}
      />

      {/* 사진 업로드 컴포넌트 */}
      <PhotoUploader
        isOpen={addPhotoModal.isOpen}
        onClose={addPhotoModal.close}
        albumId={selectedAlbumId}
        onUploadComplete={handlePhotosUploaded}
        albumSelectComponent={AlbumSelector}
      />
    </>
  );
}

export default MainPage;