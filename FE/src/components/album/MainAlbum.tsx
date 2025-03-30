import { MainAlbumProps } from "@/types/Album";
import defaultAlbumImage from "@/assets/album/blank.svg";

function MainAlbum({
  title,
  description,
  imageUrl,
  bgColor,
  photoCount
}: MainAlbumProps) {
  // 앨범 이미지 URL 체크 함수
  const getAlbumImageUrl = (url) => {
    // URL이 비어있거나 presigned URL 문자열이 포함된 경우 기본 이미지 반환
    if (!url || url.includes('presigned')) {
      return defaultAlbumImage;
    }
    return url;
  };

  // 현재 이미지 URL 확인
  const validImageUrl = getAlbumImageUrl(imageUrl);

  return (
    // 앨범 색이 적용이 안 될때, 아래 주석을 풀고 100부터 600까지 저장 후 다시 시도하면 작동함 (무슨 문제인지 모르겠습니다)
    <div className={`${bgColor} relative rounded-[8px] mb-[4px]`}>
      {/* <div className={`bg-album-600 relative rounded-[8px] mb-[15px]`}> */}
      <div className="relative z-10 p-[10px] flex flex-row">

        {/* 이미지 영역 */}
        <div className="relative w-[167px] h-[167px] bg-red-100 rounded-[8px]">
          <img
            src={validImageUrl}
            className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
            alt={title}
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col gap-1 pl-[10px] w-[50%]">
          <p className="text-h3-lg font-p-700 mt-auto">{title}</p>
          <p className="text-lg-lg">{description}</p>
          <p className="text-lg-lg mt-auto text-right">{photoCount}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-[8px]"></div>
    </div>
  );
}

export default MainAlbum;