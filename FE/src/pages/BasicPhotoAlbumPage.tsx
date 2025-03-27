import { useState, useEffect, useCallback } from "react"
import Title from "@/components/common/Title"
import InputImg from "@/components/common/Modal/InputImg"
import DropDown from "@/components/common/Modal/DropDown"
import Alert from "@/components/common/Alert"
import InfiniteScroll from "@/components/photoAlbum/InfiniteScroll"
import Modal from "@/components/common/Modal/Modal"
import useModal from "@/hooks/useModal"
import { getBasicAlbumPhotos, getPhotoUploadUrls, convertToWebP, uploadImageToS3, updateAlbumThumbnail, movePhotosToAlbum } from "@/apis/photoApi"
import { fetchAlbums } from "@/apis/albumApi"

import { CircleCheck, CirclePlus, FolderUp, ImageUp, Trash2, X } from 'lucide-react';
import Loading from "@/pages/LoadingPage"

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

  // 현재 화면에 보여줄 사진 상태
  const [photos, setPhotos] = useState<Photo[]>([]);
  // 한 번에 로드할 아이템 수와 현재 페이지
  const photosPerPage = 10; // 한 번에 2줄(10개) 로드
  const [page, setPage] = useState(1);
  // 모든 사진이 로드되었는지 확인
  const [hasMore, setHasMore] = useState(true);

  // 사진 선택 상태 관리
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isThumbnailMode, setIsThumbnailMode] = useState(false);

  // 사진 업로드 관련 상태
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 모달 관련
  const thumbnailModal = useModal();
  const addPhotoModal = useModal();
  const moveAlbumModal = useModal();

  // 앨범 이동 관련 상태
  const [targetAlbumId, setTargetAlbumId] = useState<number | null>(null);
  const [albums, setAlbums] = useState<{ id: number; title: string }[]>([]);


  // 확대해서 보기 위한 상태
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Alert 상태 관리 추가
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

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
        // API 응답을 간소화된 형태로 변환
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
      // 오류가 발생해도 UI에 표시하지 않고 기존 데이터 유지
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

  // 썸네일 모드 진입 함수
  const enterThumbnailMode = () => {
    setIsThumbnailMode(true);
    setIsSelectionMode(false);
    setSelectedPhotos([]);
  };

  // 취소하기 함수 - 모든 모드 취소
  const cancelAllModes = () => {
    setIsSelectionMode(false);
    setIsThumbnailMode(false);
    setSelectedPhotos([]);
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

  // 선택 모드 토글 함수
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setIsThumbnailMode(false);
    if (isSelectionMode) {
      // 선택 모드 종료 시 선택된 사진 초기화
      setSelectedPhotos([]);
    }
  };

  // 앨범 이동 모달 열기
  const openMoveAlbumModal = () => {
    if (selectedPhotos.length === 0) {
      setAlertMessage("이동할 사진을 먼저 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return;
    }
    moveAlbumModal.open();
  };

  // 선택된 사진 수에 따른 메시지 표시
  const getSelectionMessage = () => {
    if (!isSelectionMode) return null;

    if (selectedPhotos.length === 0) {
      return "사진을 선택해주세요";
    } else {
      return <span>사진 <span className="font-bold">{selectedPhotos.length}</span>장이 선택되었습니다.</span>;
    }
  };

  // 이미지 선택 핸들러
  const handleImagesSelected = (images: { file: File; preview: string }[]) => {
    setSelectedImages(images);
  };

  // 사진 업로드 시작 함수
  const handlePhotoUploadStart = () => {
    if (selectedImages.length === 0) {
      setAlertMessage("업로드할 사진을 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return false;
    }

    if (!albumId) {
      setAlertMessage("앨범 정보를 가져오는 중 오류가 발생했습니다.");
      setAlertColor("red");
      setShowAlert(true);
      return false;
    }

    if (isUploadingPhotos) {
      return false; // 이미 업로드 중이면 중복 실행 방지
    }

    setIsUploadingPhotos(true);
    setUploadProgress(0);

    // 비동기 업로드 프로세스 시작
    uploadPhotosProcess();

    return false; // 업로드 완료 후 수동으로 모달 닫기
  };

  // 실제 사진 업로드 프로세스 (비동기)
  const uploadPhotosProcess = async () => {
    try {
      if (!albumId || selectedImages.length === 0) {
        throw new Error("앨범 또는 이미지가 선택되지 않았습니다.");
      }

      // 1. Presigned URL 요청
      const urlsResponse = await getPhotoUploadUrls({
        albumId: albumId,
        photoLength: selectedImages.length
      });

      if (!urlsResponse || urlsResponse.length !== selectedImages.length) {
        throw new Error("업로드 URL 수신 오류");
      }

      // 2. 각 이미지를 WebP로 변환하고 S3에 업로드
      const totalImages = selectedImages.length;
      let successCount = 0;

      for (let i = 0; i < totalImages; i++) {
        try {
          // 이미지를 WebP로 변환
          const imageBlob = await convertToWebP(selectedImages[i].file);

          // S3에 업로드
          const uploadSuccess = await uploadImageToS3(
            urlsResponse[i].presignedUrl,
            imageBlob
          );

          if (uploadSuccess) {
            successCount++;
          }

          // 진행률 업데이트
          setUploadProgress(Math.floor((successCount / totalImages) * 100));
        } catch (error) {
          console.error(`이미지 ${i + 1} 업로드 실패:`, error);
        }
      }

      // 3. 완료 메시지 및 정리
      if (successCount === 0) {
        setAlertMessage("모든 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setAlertColor("red");
        setShowAlert(true);
      } else if (successCount < totalImages) {
        setAlertMessage(`${successCount}/${totalImages} 이미지가 업로드되었습니다.`);
        setAlertColor("blue");
        setShowAlert(true);
      } else {
        setAlertMessage("모든 이미지가 성공적으로 업로드되었습니다.");
        setAlertColor("green");
        setShowAlert(true);
      }

      // 이미지 업로드 완료 후 사진 목록 새로고침
      await refreshPhotos();

      // 입력 초기화
      setSelectedImages([]);

      // 모달 닫기
      addPhotoModal.close();
    } catch (error) {
      console.error("사진 업로드 오류:", error);
      setAlertMessage("사진 업로드 중 오류가 발생했습니다.");
      setAlertColor("red");
      setShowAlert(true);
    } finally {
      setIsUploadingPhotos(false);
      setUploadProgress(0);
    }
  };

  // InfiniteScroll 컴포넌트를 위한 renderItem 함수
  const renderPhoto = (photo: Photo, index: number) => (
    <div
      className={`relative aspect-square overflow-hidden cursor-pointer ${selectedPhotos.includes(index) ? 'ring-4 ring-blue-500' : ''}`}
      onClick={() => handlePhotoClick(photo, index)}
    >
      <img
        src={photo.photoUrl}
        alt={`Photo ${index + 1}`}
        className="w-full h-full object-cover"
      />
      {isSelectionMode && selectedPhotos.includes(index) && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
          ✓
        </div>
      )}
    </div>
  );

  // 썸네일 변경 처리 함수
  const handleUpdateThumbnail = () => {
    if (selectedPhotos.length === 0) {
      setAlertMessage("먼저, 썸네일로 설정할 사진을 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return false; // 모달 유지
    }

    if (!albumId) {
      setAlertMessage("앨범 정보를 가져오는 중 오류가 발생했습니다.");
      setAlertColor("red");
      setShowAlert(true);
      return false; // 모달 유지
    }

    // 선택된 사진의 ID 가져오기
    const selectedPhotoIndex = selectedPhotos[0];
    const selectedPhoto = photos[selectedPhotoIndex];

    if (!selectedPhoto) {
      setAlertMessage("선택된 사진 정보를 찾을 수 없습니다.");
      setAlertColor("red");
      setShowAlert(true);
      return false; // 모달 유지
    }

    // 썸네일 변경 프로세스 시작 (비동기 처리)
    updateThumbnailProcess(selectedPhoto.photoId);

    return false; // 모달 닫기 방지 (프로세스 완료 후 수동으로 닫을 예정)
  };

  // 실제 썸네일 업데이트 프로세스 (비동기)
  const updateThumbnailProcess = async (photoId: number) => {
    try {
      // 썸네일 변경 API 호출
      await updateAlbumThumbnail(albumId!, photoId);

      // 성공 메시지 표시
      setAlertMessage("앨범 대표 이미지가 변경되었습니다.");
      setAlertColor("green");
      setShowAlert(true);

      // 앨범 정보 새로고침
      await fetchAlbumPhotos();

      // 모달 닫고 선택 모드 초기화
      thumbnailModal.close();
      setIsThumbnailMode(false);
      setSelectedPhotos([]);
    } catch (error) {
      console.error("썸네일 변경 실패:", error);
      setAlertMessage("대표 이미지 변경 중 오류가 발생했습니다.");
      setAlertColor("red");
      setShowAlert(true);
    }
  };

  // 앨범 이동 처리 함수
  const handleMovePhotos = () => {
    if (selectedPhotos.length === 0) {
      setAlertMessage("이동할 사진을 먼저 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return false;
    }

    if (!albumId) {
      setAlertMessage("앨범 정보를 가져오는 중 오류가 발생했습니다.");
      setAlertColor("red");
      setShowAlert(true);
      return false;
    }

    if (!targetAlbumId || targetAlbumId === albumId) {
      setAlertMessage("이동할 대상 앨범을 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return false;
    }

    // 앨범 이동 프로세스 시작 (비동기 처리)
    movePhotosProcess(targetAlbumId);

    return false; // 모달 닫기 방지 (프로세스 완료 후 수동으로 닫을 예정)
  };

  // 앨범 선택 핸들러 - 이동할 대상 앨범 ID 설정
  const handleTargetAlbumSelect = (selectedAlbumId: number) => {
    setTargetAlbumId(selectedAlbumId);
  };

  // 실제 사진 이동 프로세스 (비동기)
  const movePhotosProcess = async (targetAlbumId: number) => {
    try {
      // 선택된 사진들의 ID 목록 생성
      const photoIds = selectedPhotos.map(index => photos[index].photoId);

      // 사진 이동 API 호출
      await movePhotosToAlbum(albumId!, targetAlbumId, photoIds);

      // 성공 메시지 표시
      setAlertMessage("선택한 사진이 성공적으로 이동되었습니다.");
      setAlertColor("green");
      setShowAlert(true);

      // 앨범 정보 새로고침
      await fetchAlbumPhotos();

      // 모달 닫고 선택 모드 초기화
      moveAlbumModal.close();
      setIsSelectionMode(false);
      setSelectedPhotos([]);
    } catch (error) {
      console.error("사진 이동 실패:", error);
      setAlertMessage("사진 이동 중 오류가 발생했습니다.");
      setAlertColor("red");
      setShowAlert(true);
    }
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
            <CirclePlus size={18} />
            <span>사진 추가하기</span>
          </button>
        </div>

        {/* 사진 추가 모달 */}
        <Modal
          isOpen={addPhotoModal.isOpen}
          onClose={isUploadingPhotos ? undefined : addPhotoModal.close}
          title="추억 보관하기"
          confirmButtonText={isUploadingPhotos ? `업로드 중... ${uploadProgress}%` : "보관하기"}
          cancelButtonText={isUploadingPhotos ? undefined : "취소하기"}
          onConfirm={handlePhotoUploadStart}
        >
          <div className="py-2">
            <p className="mb-4">
              사진은 최대 5장까지 한 번에 추가할 수 있습니다.
            </p>

            {/* 업로드 진행 상태 표시 */}
            {isUploadingPhotos && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  {uploadProgress}% 완료
                </p>
              </div>
            )}

            <InputImg onImagesSelected={handleImagesSelected} />
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <>
      {showAlert && (
        <Alert message={alertMessage} color={alertColor} />
      )}

      <div className="container">
        <div className="flex space-x-6 mb-3">
          <Title text={albumName} />
          <div className="flex mt-auto space-x-5 justify-end w-3/4">
            {!isSelectionMode && !isThumbnailMode ? (
              <>
                {/* 일반 모드 버튼들 */}
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={toggleSelectionMode}
                >
                  <CircleCheck strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'21px'} />

                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-300"></div>
                  <p className="font-p-500 text-subtitle-1-lg">선택하기</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={enterThumbnailMode}
                >
                  <ImageUp strokeWidth={1} className="absolute z-30 ml-[-4px] mt-[2px]" size={'21px'} />

                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-300"></div>
                  <p className="font-p-500 text-subtitle-1-lg">썸네일 변경</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={addPhotoModal.open}
                >
                  <CirclePlus strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'21px'} />

                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-album-200"></div>
                  <p className="font-p-500 text-subtitle-1-lg">사진 추가</p>
                </div>
              </>
            ) : isSelectionMode ? (
              <>
                {/* 선택 모드 버튼들 */}
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={toggleSelectionMode}
                >
                  <X strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'23px'} />

                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-400"></div>
                  <p className="font-p-500 text-subtitle-1-lg">취소하기</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={openMoveAlbumModal}
                >
                  <FolderUp strokeWidth={1} className="absolute z-30 ml-[-5pX] mt-[2px]" size={'22px'} />

                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-400"></div>
                  <p className="font-p-500 text-subtitle-1-lg">앨범 이동하기</p>
                </div>
              </>
            ) : (
              <>
                {/* 썸네일 모드 버튼들 */}
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={cancelAllModes}
                >
                  <X strokeWidth={1} className="absolute z-30 ml-[-3pX] mt-[2px]" size={'23px'} />

                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-400"></div>
                  <p className="font-p-500 text-subtitle-1-lg">취소하기</p>
                </div>
                <div className="flex space-x-1">
                  <ImageUp strokeWidth={1} className="absolute z-30 ml-[-4px] mt-[2px]" size={'21px'} />
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-300"></div>
                  <p className="font-p-500 text-subtitle-1-lg">썸네일 변경</p>
                </div>
              </>
            )}
          </div>
        </div>
        {isSelectionMode ? (
          <p className="text-red-200 font-p-500 text-subtitle-1-lg">
            {getSelectionMessage()}
          </p>
        ) : isThumbnailMode ? (
          <p className="text-red-200 font-p-500 text-subtitle-1-lg">
            대표 이미지로 설정할 사진을 선택해주세요.
          </p>
        ) : (
          <p className="text-transparent h-[24px] text-subtitle-1-lg"></p>
        )}
      </div>

      {/* 무한 스크롤 컴포넌트로 변경 */}
      <InfiniteScroll
        items={photos}
        renderItem={renderPhoto}
        loadMoreItems={loadMorePhotos}
        hasMore={hasMore}
      />

      {/* 확대된 사진 모달 */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <img
              src={enlargedPhoto}
              alt="Enlarged photo"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setEnlargedPhoto(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 대표 이미지 변경 모달 */}
      <Modal
        isOpen={thumbnailModal.isOpen}
        onClose={thumbnailModal.close}
        title="대표 이미지 변경하기"
        confirmButtonText="변경하기"
        cancelButtonText="취소하기"
        onConfirm={handleUpdateThumbnail}
      >
        <div className="py-2">
          <p className="mb-4">썸네일로 등록할 사진을 확인해주세요</p>
          <div className="w-full flex justify-center">
            {selectedPhotos.length > 0 && (
              <img
                src={photos[selectedPhotos[0]]?.photoUrl}
                alt="Selected thumbnail"
                className="h-64 object-cover"
              />
            )}
          </div>
        </div>
      </Modal>

      {/* 사진 추가 모달 */}
      <Modal
        isOpen={addPhotoModal.isOpen}
        onClose={isUploadingPhotos ? undefined : addPhotoModal.close}
        title="추억 보관하기"
        confirmButtonText={isUploadingPhotos ? `업로드 중... ${uploadProgress}%` : "보관하기"}
        cancelButtonText={isUploadingPhotos ? undefined : "취소하기"}
        onConfirm={handlePhotoUploadStart}
      >
        <div className="py-2">
          <p className="mb-4">
            사진은 최대 5장까지 한 번에 추가할 수 있습니다.
          </p>

          {/* 업로드 진행 상태 표시 */}
          {isUploadingPhotos && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {uploadProgress}% 완료
              </p>
            </div>
          )}

          <InputImg onImagesSelected={handleImagesSelected} />
        </div>
      </Modal>

      {/* 앨범 이동 모달 */}
      <Modal
        isOpen={moveAlbumModal.isOpen}
        onClose={moveAlbumModal.close}
        title="앨범 이동하기"
        confirmButtonText="이동하기"
        cancelButtonText="취소하기"
        onConfirm={handleMovePhotos}
      >
        <div className="py-2">
          <p className="mb-4">이동할 앨범을 선택해주세요.</p>
          <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">
            앨범 선택하기
          </p>
          <DropDown
            albums={albums}
            currentAlbumId={albumId}
            onSelectAlbum={handleTargetAlbumSelect}
            placeholder="앨범을 선택해주세요"
          />
          <div className="text-sm text-gray-500 mt-2">
            선택된 사진 {selectedPhotos.length}장을 이동합니다.
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BasicPhotoAlbumPage;