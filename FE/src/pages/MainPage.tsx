import SlidingAlbumList from "@/components/album/SlidingAlbumList"
import useAlbumStore from "@/stores/useAlbumStore";
import { useModal } from '@/hooks/useModal';
import { useNavigate } from 'react-router-dom';

// 모달창 관련 컴포넌트
import InputText from "@/components/common/Modal/InputText";
import InputImg from "@/components/common/Modal/InputImg";
import DropDown from "@/components/common/Modal/DropDown";

function MainPage() {
  const { currentAlbum } = useAlbumStore();
  const navigate = useNavigate();

  // 모달 관련
  const { openModal } = useModal();

  // 앨범 클릭 시 해당 앨범 상세 페이지로 이동
  const handleAlbumClick = () => {
    if (!currentAlbum) return;
    
    // 앨범 ID가 1인 경우 BasicPhotoAlbumPage로 이동
    if (currentAlbum.id === 1) {
      navigate('/album/basic');
    } else {
      // 그 외의 경우 일반 PhotoAlbumPage로 이동하며 id 전달
      navigate(`/album/${currentAlbum.id}`);
    }
  };

  return (
    <>
      {/* 임시 헤더 영역 */}
      <div className="w-full h-[65px] z-50 fixed top-0 left-0 bg-white opacity-[80%]">
        <p className="text-h-logo-lg font-p-800 p-[16px]">추억방울</p>
      </div>

      {/* 여기서부터 MainPage */}
      <div className={`${currentAlbum?.bgColor || 'bg-p-800'} h-screen transition-colors duration-500`}>
        <div className="flex w-[90%] ml-0 z-0 relative">
          {/* 영역1 */}
          <div className="flex-[80] h-screen text-white text-center pt-[65px] justyfi-center item-center relative flex">
            {/* 앨범 이미지 영역 */}
            <div className="flex mb-auto w-full">

              {/* 앨범 제목 */}
              <div className={`absolute z-10 w-full bg-p-800 ${currentAlbum?.bgColor || 'bg-album-200'} transition-colors duration-500`}>
                <div className='relative h-[180px] w-full overflow-hidden bg-transparent text-left z-10'>
                  <p
                    className='absolute text-album-1-lg font-p-800 bg-clip-text w-[94%]
                    drop-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]
                    '
                    style={{
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      // WebkitTextStroke:"1px rgba(0, 0, 0, 0.1)", // 글자 stroke 버전
                      backgroundImage: `url('${currentAlbum?.imageUrl || "./assets/album-1.png"}')`,
                      backgroundSize: "100%"
                    }}>
                    {currentAlbum?.title || "추억보관함"}
                  </p>
                </div>
              </div>

              {/* 앨범 이미지 - 클릭 이벤트 추가 */}
              <img
                src={currentAlbum?.imageUrl || "./assets/album-1.png"}
                className='w-[94%] object-cover cursor-pointer'
                onClick={handleAlbumClick}
              />
            </div>

          </div>

          {/* 영역2 - 앨범 리스트 뒤에 보이지 않는 영역 */}
          <div className="flex-[30]" />

          {/* 앨범 리스트 컴포넌트 */}
          <div className="h-full bg-blue-400">
            <SlidingAlbumList />
            <div className="fixed w-[360px] p-4 mr-auto ml-[-380px] bottom-[8px] z-40 grid grid-cols-2 gap-4">
              <button
                onClick={() => openModal({
                  title: "앨범 생성",
                  content: (
                    <div className="py-2">
                      <p className="mb-4">새로운 추억보관함을 생성해보세요!</p>
                      <p className="text-subtitle-1-lg font-p-500 text-black">앨범 이름 (최대 7자)</p>
                      <InputText />
                      <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">앨범 한 줄 설명 (최대 60자)</p>
                      <InputText />
                      <p className="mt-[3px]  text-subtitle-1-lg font-p-500 text-black">표지색 정하기</p>

                      <div className="flex space-x-3 mt-[12px] mb-[8px]">
                        <div className="w-[35px] h-[35px] rounded-full bg-album-100"></div>
                        <div className="w-[35px] h-[35px] rounded-full bg-album-200"></div>
                        <div className="w-[35px] h-[35px] rounded-full bg-album-300"></div>
                        <div className="w-[35px] h-[35px] rounded-full bg-album-400"></div>
                        <div className="w-[35px] h-[35px] rounded-full bg-album-500"></div>
                        <div className="w-[35px] h-[35px] rounded-full bg-album-600"></div>
                      </div>
                    </div>
                  ),
                  confirmButtonText: "생성하기",
                  cancelButtonText: "취소하기",
                })}
                className="flex cursor-pointer justify-center bg-white pt-[14px] pb-[14px] rounded-[8px] shadow-md"
              >
                <p className="text-subtitle-1-lg font-p-500">
                  앨범 생성
                </p>
              </button>
              <button
                onClick={() => openModal({

                  title: "추억 보관하기",
                  content: (
                    <div className="py-2">
                      <p className="mb-4">사진은 최대 5장까지 한 번에 추가할 수 있습니다.</p>
                      <InputImg />
                      <p className="mt-[3px] text-subtitle-1-lg font-p-500 text-black">앨범 선택하기</p>
                      <DropDown />

                    </div>
                  ),
                  confirmButtonText: "보관하기",
                  cancelButtonText: "취소하기",
                })}
                className="flex cursor-pointer justify-center bg-white pt-[14px] pb-[14px] rounded-[8px] shadow-md">
                <p className="text-subtitle-1-lg font-p-500">
                  사진 추가
                </p>
              </button>

            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default MainPage