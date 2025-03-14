import SlidingAlbumList from "../components/album/SlidingAlbumList"

import useAlbumStore from "../stores/useAlbumStore";

function MainPage() {

  const {currentAlbum} = useAlbumStore();

  return (
    <>
      {/* 임시 헤더 영역 */}
      <div className="w-full h-[65px] z-50 fixed top-0 left-0 bg-white opacity-[80%]">
        <p className="text-h-logo-lg font-h-logo p-[16px]">추억방울</p>
      </div>

      {/* 여기서부터 MainPage */}
      <div className={`${currentAlbum?.bgColor || 'bg-album-200'} h-screen transition-colors duration-500`}>
        <div className="flex w-[90%] ml-0 z-0 relative flex">
          {/* 영역1 */}
          <div className="flex-[80] h-screen text-white text-center pt-[65px] justyfi-center item-center relative flex">
            {/* 앨범 이미지 영역 */}
            <div className="flex mb-auto w-full">

              {/* 앨범 제목 */}
              <div className={`absolute z-10 w-full bg-album-200 ${currentAlbum?.bgColor || 'bg-album-200'} transition-colors duration-500`}>
                <div className='relative h-[180px] w-full overflow-hidden bg-transparent text-left z-10'>
                  <p
                    className='absolute text-album-1-lg font-album-1 bg-clip-text w-[94%]
                    drop-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]
                    '
                    style={{
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      // WebkitTextStroke:"1px rgba(0, 0, 0, 0.1)", // 글자 stroke 버전
                      backgroundImage: `url('${currentAlbum?.imageUrl || "src/assets/images/album-1.png"}')`,
                      backgroundSize: "100%"
                    }}>
                    {currentAlbum?.title || "추억보관함"}
                  </p>
                </div>
              </div>

              {/* 앨범 이미지 */}
              <img
                src={currentAlbum?.imageUrl || "src/assets/images/album-1.png"}
                className='w-[94%] object-cover'
              />
            </div>

          </div>

          {/* 영역2 - 앨범 리스트 뒤에 보이지 않는 영역 */}
          <div className="flex-[30]" />

          {/* 앨범 리스트 컴포넌트 */}
          <div className="h-full bg-blue-400">
            <SlidingAlbumList />
            <div className="fixed w-[360px] p-4 mr-auto ml-[-380px] bottom-[8px] z-40 grid grid-cols-2 gap-4">
              <div className="flex cursor-pointer justify-center bg-gray-000 pt-[14px] pb-[14px] rounded-[8px] shadow-md">
                <p className="text-subtitle-1-lg font-subtitle-1">
                  앨범 생성
                </p>
              </div>
              <div className="flex cursor-pointer justify-center bg-gray-000 pt-[14px] pb-[14px] rounded-[8px] shadow-md">
                <p className="text-subtitle-1-lg font-subtitle-1">
                  사진 추가
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage