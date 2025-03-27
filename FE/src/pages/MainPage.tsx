import { useEffect, useState } from "react";
import SlidingAlbumList from "@/components/album/SlidingAlbumList";
import useAlbumStore from "@/stores/useAlbumStore";
import { useNavigate } from 'react-router-dom';
import Modal from "@/components/common/Modal/Modal";
import useModal from "@/hooks/useModal";

// 모달창 관련 컴포넌트
import InputText from "@/components/common/Modal/InputText";
import InputImg from "@/components/common/Modal/InputImg";
import DropDown from "@/components/common/Modal/DropDown";
import Loading from "./LoadingPage";

import useUserStore from "@/stores/useUserStore";
import { createAlbum } from "@/apis/albumApi";

// 기본 앨범 이미지 불러오기
import defaultAlbumImage from "@/assets/album/blank.svg";
import apiClient from "@/apis/apiClient";

function MainPage() {
  const { currentAlbum, fetchAlbumsData, isLoading, error } = useAlbumStore();
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  // 앨범 생성 폼 상태 관리
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#f4e2dc"); // 기본 색상
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  // 색상 옵션
  const colorOptions = [
    { id: 1, value: "#f4e2dc", class: "bg-album-100" },
    { id: 2, value: "#f3d1b2", class: "bg-album-200" },
    { id: 3, value: "#f7f0d5", class: "bg-album-300" },
    { id: 4, value: "#bfdaab", class: "bg-album-400" },
    { id: 5, value: "#c5dfe6", class: "bg-album-500" },
    { id: 6, value: "#b3c6e3", class: "bg-album-600" }
  ];

  // 컴포넌트 마운트 시 앨범 데이터 가져오기
  useEffect(() => {
    fetchAlbumsData();
  }, [fetchAlbumsData]);

  // familyId를 store에서 불러오지 못해서 추가함
  useEffect(() => {
    // users/me에서 한 번 더 familyId 호출해야 join 가능
    const handle = async () => {
      const userResponse = await apiClient.get("/api/users/me")
      const { familyId } = userResponse.data
      console.log("main : " + familyId)
      setUser({
        familyId
      })
    }

    handle()
  }, [])

  // 모달 관련
  const createAlbumModal = useModal();
  const addPhotoModal = useModal();

  console.log("familyId : " + user.familyId);

  // 앨범 클릭 시 해당 앨범 상세 페이지로 이동
  const handleAlbumClick = () => {
    if (!currentAlbum) return;

    // 앨범 ID가 확인되면 해당 페이지로 이동
    navigate(`/album/${currentAlbum.id}`);
  };

  // 앨범 이미지 URL 체크 함수
  const getAlbumImageUrl = (url) => {
    // URL이 비어있거나 presigned URL 문자열이 포함된 경우 기본 이미지 반환
    if (!url || url.includes('presigned')) {
      return defaultAlbumImage;
    }
    return url;
  };

  // 폼 입력 검증
  const validateAlbumForm = () => {
    if (!albumName.trim()) {
      alert("앨범 이름을 입력해주세요.");
      return false;
    }
    return true;
  };

  // 앨범 생성 시작 (동기 함수)
  const handleCreateAlbumStart = () => {
    if (!validateAlbumForm() || isCreatingAlbum) {
      return false; // 모달 닫기 방지
    }

    setIsCreatingAlbum(true);

    // 비동기 처리 시작 - 결과는 별도로 처리
    createAlbumProcess();

    return false; // 모달은 API 호출 완료 후 수동으로 닫을 것임
  };

  // 실제 앨범 생성 프로세스 (비동기)
  const createAlbumProcess = async () => {
    try {
      // 앨범 생성 요청
      await createAlbum({
        familyId: user.familyId || 0,
        albumName: albumName.trim(),
        albumContent: albumDescription.trim(),
        backgroundColor: selectedColor
      });

      // 앨범 목록 다시 불러오기
      await fetchAlbumsData();

      // 성공 메시지
      alert("앨범이 생성되었습니다.");

      // 입력 필드 초기화
      setAlbumName("");
      setAlbumDescription("");
      setSelectedColor("#f4e2dc");

      // 모달 닫기
      createAlbumModal.close();
    } catch (error) {
      console.error("앨범 생성 오류:", error);
      alert("앨범 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreatingAlbum(false);
    }
  };

  // 색상 선택 핸들러
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
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

        {/* 앨범 생성 모달 */}
        <Modal
          isOpen={createAlbumModal.isOpen}
          onClose={createAlbumModal.close}
          title="앨범 생성"
          confirmButtonText={isCreatingAlbum ? "생성 중..." : "생성하기"}
          cancelButtonText="취소하기"
          onConfirm={handleCreateAlbumStart}
        >
          <div className="py-2">
            <p className="mb-4">새로운 추억보관함을 생성해보세요!</p>
            <p className="text-subtitle-1-lg font-p-500 text-black">앨범 이름 (최대 7자)</p>
            <InputText
              value={albumName}
              onChange={setAlbumName}
              maxLength={7}
              placeholder="앨범 이름을 입력해주세요"
            />
            <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">앨범 한 줄 설명 (최대 60자)</p>
            <InputText
              value={albumDescription}
              onChange={setAlbumDescription}
              maxLength={60}
              placeholder="앨범 설명을 입력해주세요"
            />
            <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">표지색 정하기</p>

            <div className="flex space-x-3 mt-[12px] mb-[8px]">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className={`w-[35px] h-[35px] rounded-full ${color.class} cursor-pointer
                    ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                  `}
                  onClick={() => handleColorSelect(color.value)}
                ></div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // 앨범 이미지 URL 확인
  const albumImageUrl = getAlbumImageUrl(currentAlbum.imageUrl);

  return (
    <>
      {/* 여기서부터 MainPage */}
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

          {/* 앨범 리스트 컴포넌트 */}
          <div className="h-full">
            <SlidingAlbumList />
            <div className="fixed w-[360px] p-4 mr-auto ml-[-380px] bottom-[8px] z-40 grid grid-cols-2 gap-4">
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
      </div>

      {/* 앨범 생성 모달 */}
      <Modal
        isOpen={createAlbumModal.isOpen}
        onClose={createAlbumModal.close}
        title="앨범 생성"
        confirmButtonText={isCreatingAlbum ? "생성 중..." : "생성하기"}
        cancelButtonText="취소하기"
        onConfirm={handleCreateAlbumStart}
      >
        <div className="py-2">
          <p className="mb-4">새로운 추억보관함을 생성해보세요!</p>
          <p className="text-subtitle-1-lg font-p-500 text-black">앨범 이름 (최대 7자)</p>
          <InputText
            value={albumName}
            onChange={setAlbumName}
            maxLength={7}
            placeholder="앨범 이름을 입력해주세요"
          />
          <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">앨범 한 줄 설명 (최대 60자)</p>
          <InputText
            value={albumDescription}
            onChange={setAlbumDescription}
            maxLength={60}
            placeholder="앨범 설명을 입력해주세요"
          />
          <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">표지색 정하기</p>

          <div className="flex space-x-3 mt-[12px] mb-[8px]">
            {colorOptions.map((color) => (
              <div
                key={color.id}
                className={`w-[35px] h-[35px] rounded-full ${color.class} cursor-pointer
                  ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                `}
                onClick={() => handleColorSelect(color.value)}
              ></div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 사진 추가 모달 */}
      <Modal
        isOpen={addPhotoModal.isOpen}
        onClose={addPhotoModal.close}
        title="추억 보관하기"
        confirmButtonText="보관하기"
        cancelButtonText="취소하기"
      >
        <div className="py-2">
          <p className="mb-4">사진은 최대 5장까지 한 번에 추가할 수 있습니다.</p>
          <InputImg />
          <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">앨범 선택하기</p>
          <DropDown />
        </div>
      </Modal>
    </>
  )
}

export default MainPage