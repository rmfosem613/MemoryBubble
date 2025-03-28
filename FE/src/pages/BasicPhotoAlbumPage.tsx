import { useState, useEffect, useCallback } from "react";
import Title from "@/components/common/Title";
import Alert from "@/components/common/Alert";
import useModal from "@/hooks/useModal";
import { getBasicAlbumPhotos } from "@/apis/photoApi";
import { fetchAlbums } from "@/apis/albumApi";
import Loading from "@/pages/LoadingPage";

// 새로 분리한 컴포넌트들 임포트
import PhotoUploader from "@/components/photo/PhotoUploader";
import PhotoActionBar from "@/components/photo/PhotoActionBar";
import ThumbnailSelector from "@/components/photo/ThumbnailSelector";
import PhotoModal from "@/components/photo/PhotoModal";
import PhotoMover from "@/components/photo/PhotoMover";
import PhotoGrid from "@/components/photo/PhotoGrid";

interface Photo {
  photoId: number;
  photoUrl: string;
}

function BasicPhotoAlbumPage() {
  // 앨범 정보 상태
  const [albumName, setAlbumName] = useState<string>("추억보관함");
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 화면에 보여줄 사진 상태와 페이징
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photosPerPage = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 사진 선택 및 모드 상태
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isThumbnailMode, setIsThumbnailMode] = useState(false);

  // 앨범 이동 관련 상태
  const [albums, setAlbums] = useState<{ id: number; title: string }[]>([]);

  // 확대 사진 상태
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Alert 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 모달 관련
  const thumbnailModal = useModal();
  const addPhotoModal = useModal();
  const moveAlbumModal = useModal();

  // 첫 번째 앨범 ID 가져오기 (추억보관함 앨범)
  const getFirstAlbumId = useCallback(async () => {
    try {
      const albums = await fetchAlbums();
      if (albums && albums.length > 0) {
        return albums[0].albumId;
      }
      throw new Error("앨범이 없습니다.");
    } catch (error) {
      console.error("앨범 ID 가져오기 실패:", error);
      throw error;
    }
  }, []);

  // 모든 앨범 목록 가져오기
  useEffect(() => {
    const getAllAlbums = async () => {
      try {
        const albumsData = await fetchAlbums();
        const formattedAlbums = albumsData.map(album => ({
          id: album.albumId,
          title: album.albumName
        }));
        setAlbums(formattedAlbums);
      } catch (error) {
        console.error("앨범 목록 가져오기 실패:", error);
      }
    };

    getAllAlbums();
  }, []);

  // 앨범 사진 데이터 가져오기
  const fetchAlbumPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const albumData = await getBasicAlbumPhotos();
      setAlbumName(albumData.albumName || "추억보관함");
      setAllPhotos(albumData.photoList || []);

      // 첫 번째 앨범 ID 가져와서 저장
      const firstAlbumId = await getFirstAlbumId();
      setAlbumId(firstAlbumId);

      // 초기 페이지 설정
      setPage(1);
      setPhotos([]);
      setHasMore(albumData.photoList.length > 0);
    } catch (err) {
      console.error("앨범 사진 로드 실패:", err);
      setError("앨범 사진을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [getFirstAlbumId]);

  // 앨범 사진 새로고침
  const refreshPhotos = useCallback(async () => {
    try {
      const albumData = await getBasicAlbumPhotos();
      setAllPhotos(albumData.photoList || []);
      setPage(1);
      setPhotos([]);
      setHasMore(albumData.photoList.length > 0);
    } catch (err) {
      console.error("앨범 사진 새로고침 실패:", err);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchAlbumPhotos();
  }, [fetchAlbumPhotos]);

  // 이미지 로드 함수
  const loadMorePhotos = useCallback(() => {
    if (!hasMore || isLoading) return;

    const startIndex = (page - 1) * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    const newPhotos = allPhotos.slice(startIndex, endIndex);

    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos]);
      setPage(prev => prev + 1);
    }

    // 모든 사진을 다 불러왔는지 확인
    if (endIndex >= allPhotos.length) {
      setHasMore(false);
    }
  }, [page, hasMore, allPhotos, isLoading]);

  // 초기 이미지 로드
  useEffect(() => {
    if (!isLoading && allPhotos.length > 0) {
      loadMorePhotos();
    }
  }, [allPhotos, isLoading, loadMorePhotos]);

  // 모드 전환 함수들
  const enterThumbnailMode = () => {
    setIsThumbnailMode(true);
    setIsSelectionMode(false);
    setSelectedPhotos([]);
  };

  const cancelAllModes = () => {
    setIsSelectionMode(false);
    setIsThumbnailMode(false);
    setSelectedPhotos([]);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setIsThumbnailMode(false);
    if (isSelectionMode) {
      setSelectedPhotos([]);
    }
  };

  // 사진 클릭 처리 함수
  const handlePhotoClick = (photo: Photo, index: number) => {
    if (isSelectionMode) {
      // 선택 모드에서는 사진 선택/해제
      if (selectedPhotos.includes(index)) {
        setSelectedPhotos(selectedPhotos.filter(i => i !== index));
      } else {
        setSelectedPhotos([...selectedPhotos, index]);
      }
    } else if (isThumbnailMode) {
      // 썸네일 모드에서는 한 장만 선택하고 모달 열기
      setSelectedPhotos([index]);
      thumbnailModal.open();
    } else {
      // 일반 모드에서는 사진 확대
      setEnlargedPhoto(photo.photoUrl);
    }
  };

  // 앨범 이동 모달 열기
  const openMoveAlbumModal = () => {
    if (selectedPhotos.length === 0) {
      showAlertMessage("이동할 사진을 먼저 선택해주세요.");
      return;
    }
    moveAlbumModal.open();
  };

  // Alert 표시 함수
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);
  };

  // 선택된 썸네일 이미지 URL 얻기
  const getSelectedThumbnailUrl = (): string | null => {
    if (selectedPhotos.length === 0) return null;
    const selectedPhotoIndex = selectedPhotos[0];
    return photos[selectedPhotoIndex]?.photoUrl || null;
  };

  // 선택된 썸네일 이미지 ID 얻기
  const getSelectedThumbnailId = (): number | null => {
    if (selectedPhotos.length === 0) return null;
    const selectedPhotoIndex = selectedPhotos[0];
    return photos[selectedPhotoIndex]?.photoId || null;
  };

  // 선택된 사진 ID 배열 얻기
  const getSelectedPhotoIds = (): number[] => {
    return selectedPhotos.map(index => photos[index]?.photoId).filter(Boolean) as number[];
  };

  // 로딩 중 표시
  if (isLoading) {
    return <Loading message="사진을 불러오는 중..." />;
  }

  // 오류 표시
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white flex-col">
        <p className="text-subtitle-1-lg font-p-500 text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-p-800 text-white rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 사진이 없는 경우
  if (allPhotos.length === 0) {
    return (
      <div className="container mt-8">
        <div className="flex space-x-6 mb-3">
          <Title text={albumName} />
        </div>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-subtitle-1-lg font-p-500 text-gray-500 mb-4">아직 사진이 없습니다.</p>
          <button
            onClick={addPhotoModal.open}
            className="flex items-center space-x-2 px-4 py-2 bg-p-800 text-white rounded-md"
          >
            <span>사진 추가하기</span>
          </button>
        </div>

        {/* 사진 업로더 컴포넌트 */}
        <PhotoUploader
          isOpen={addPhotoModal.isOpen}
          onClose={addPhotoModal.close}
          albumId={albumId}
          onUploadComplete={refreshPhotos}
        />
      </div>
    );
  }

  return (
    <>
      {showAlert && (
        <Alert message={alertMessage} color={alertColor} />
      )}

      <div className="container">
        <div className="flex space-x-6 mb-6 mt-[10px]">
          <Title text={albumName} />
          <div className="flex space-x-1 h-[40px] justify-end w-full relative mt-[100px]">
            {/* 사진 액션 바 컴포넌트 */}
            <PhotoActionBar
              mode={isSelectionMode ? 'selection' : (isThumbnailMode ? 'thumbnail' : 'normal')}
              onToggleSelectionMode={toggleSelectionMode}
              onEnterThumbnailMode={enterThumbnailMode}
              onCancelMode={cancelAllModes}
              onAddPhoto={addPhotoModal.open}
              onMovePhotos={openMoveAlbumModal}
              selectionCount={selectedPhotos.length}
            />
          </div>
        </div>
      </div>

      {/* 사진 그리드 컴포넌트 */}
      <PhotoGrid
        photos={photos}
        selectedPhotoIndices={selectedPhotos}
        isSelectionMode={isSelectionMode}
        isThumbnailMode={isThumbnailMode}
        onPhotoClick={handlePhotoClick}
        onLoadMore={loadMorePhotos}
        hasMore={hasMore}
      />

      {/* 사진 확대 모달 컴포넌트 */}
      <PhotoModal
        photoUrl={enlargedPhoto}
        onClose={() => setEnlargedPhoto(null)}
      />

      {/* 썸네일 선택기 컴포넌트 */}
      <ThumbnailSelector
        isOpen={thumbnailModal.isOpen}
        onClose={thumbnailModal.close}
        albumId={albumId}
        selectedPhotoId={getSelectedThumbnailId()}
        photoUrl={getSelectedThumbnailUrl()}
        onUpdateComplete={fetchAlbumPhotos}
        onError={showAlertMessage}
      />

      {/* 사진 업로더 컴포넌트 */}
      <PhotoUploader
        isOpen={addPhotoModal.isOpen}
        onClose={addPhotoModal.close}
        albumId={albumId}
        onUploadComplete={refreshPhotos}
      />

      {/* 사진 이동 컴포넌트 */}
      <PhotoMover
        isOpen={moveAlbumModal.isOpen}
        onClose={moveAlbumModal.close}
        sourceAlbumId={albumId}
        photoIds={getSelectedPhotoIds()}
        albums={albums}
        onMoveComplete={fetchAlbumPhotos}
        onError={showAlertMessage}
      />
    </>
  );
}

export default BasicPhotoAlbumPage;