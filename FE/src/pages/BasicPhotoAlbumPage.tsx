import { useState } from "react"
import Title from "@/components/common/Title"
import album1 from "/assets/album-1.png"
import album2 from "/assets/album-2.png"
import album3 from "/assets/album-3.png"
import album4 from "/assets/album-4.png"
import album5 from "/assets/album-5.png"
import { useModal } from '@/hooks/useModal'
import InputImg from "@/components/common/Modal/InputImg"
import DropDown from "@/components/common/Modal/DropDown"
import Alert from "@/components/common/Alert"

function BasicPhotoAlbumPage() {
  const photos = [
    album1, album2, album3, album4, album5,
    album2, album3, album4, album5, album1,
    album3, album4, album5, album1, album2,
    album4, album5, album1, album2, album3,
  ];

  // 사진 선택 상태 관리
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isThumbnailMode, setIsThumbnailMode] = useState(false);

  // 모달 관련
  const { openModal } = useModal();

  // 확대해서 보기 위한 상태
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Alert 상태 관리 추가
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

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
  const handlePhotoClick = (photo: string, index: number) => {
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

      // 대표 이미지 변경 모달 열기
      openModal({
        title: "대표 이미지 변경하기",
        content: (
          <div className="py-2">
            {/* 선택한 이미지 보이기 */}
            <p className="mb-4">썸네일로 등록할 사진을 확인해주세요</p>
            <div className="w-full flex justify-center">
              <img
                src={photo}
                alt="Selected thumbnail"
                className="h-64 object-cover"
              />
            </div>
          </div>
        ),
        confirmButtonText: "변경하기",
        cancelButtonText: "취소하기",
      });
    } else {
      // 일반 모드에서는 사진 확대
      setEnlargedPhoto(photo);
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

  // 사진 추가 모달 열기
  const openAddPhotoModal = () => {
    openModal({
      title: "추억 보관하기",
      content: (
        <div className="py-2">
          <p className="mb-4">사진은 최대 5장까지 한 번에 추가할 수 있습니다.</p>
          <InputImg />
        </div>
      ),
      confirmButtonText: "보관하기",
      cancelButtonText: "취소하기",
    });
  };

  // 앨범 이동 모달 열기
  const openMoveAlbumModal = () => {
    if (selectedPhotos.length === 0) {
      setAlertMessage("이동할 사진을 먼저 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return;
    }

    openModal({
      title: "앨범 이동하기",
      content: (
        <div className="py-2">
          <p className="mb-4">이동할 앨범을 선택해주세요.</p>
          <p className="mt-3 text-subtitle-1-lg font-p-500 text-black">앨범 선택하기</p>
          <DropDown />
          <div className="h-[130px]"></div>
        </div>
      ),
      confirmButtonText: "이동하기",
      cancelButtonText: "취소하기",
    });
  };

  // 선택한 사진 삭제
  const deleteSelectedPhotos = () => {
    if (selectedPhotos.length === 0) {
      setAlertMessage("삭제할 사진을 먼저 선택해주세요.");
      setAlertColor("red");
      setShowAlert(true);
      return;
    }

    // 모달을 열고 확인 버튼에 대한 콜백 함수를 제공
    openModal({
      title: "사진 삭제하기",
      content: (
        <div className="py-2">
          <p className="mb-4">사진을 삭제하시겠습니까?</p>
        </div>
      ),
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소하기",
    });
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

  return (
    <>
      {showAlert && (
        <Alert message={alertMessage} color={alertColor} />
      )}

      <div className="container">
        <div className="flex space-x-6 mb-3">
          <Title text="추억보관함" />
          <div className="flex mt-auto space-x-5 justify-end w-3/4">
            {!isSelectionMode && !isThumbnailMode ? (
              <>
                {/* 일반 모드 버튼들 */}
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={toggleSelectionMode}
                >
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-300"></div>
                  <p className="font-p-500 text-subtitle-1-lg">선택하기</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={enterThumbnailMode}
                >
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-300"></div>
                  <p className="font-p-500 text-subtitle-1-lg">썸네일 변경</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={openAddPhotoModal}
                >
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
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-400"></div>
                  <p className="font-p-500 text-subtitle-1-lg">취소하기</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={openMoveAlbumModal}
                >
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-blue-400"></div>
                  <p className="font-p-500 text-subtitle-1-lg">앨범 이동하기</p>
                </div>
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={deleteSelectedPhotos}
                >
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-red-200 opacity-[70%]"></div>
                  <p className="font-p-500 text-subtitle-1-lg">삭제하기</p>
                </div>
              </>
            ) : (
              <>
                {/* 썸네일 모드 버튼들 */}
                <div
                  className="flex space-x-1 cursor-pointer"
                  onClick={cancelAllModes}
                >
                  <div className="flex mt-auto w-3.5 h-3.5 rounded-full bg-gray-400"></div>
                  <p className="font-p-500 text-subtitle-1-lg">취소하기</p>
                </div>
                <div className="flex space-x-1">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 mt-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`relative aspect-square overflow-hidden cursor-pointer ${selectedPhotos.includes(index) ? 'ring-4 ring-blue-500' : ''}`}
            onClick={() => handlePhotoClick(photo, index)}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {isSelectionMode && selectedPhotos.includes(index) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

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
    </>
  )
}

export default BasicPhotoAlbumPage