import { MainAlbumProps } from "@/types/Album";
import defaultAlbumImage from "@/assets/album/blank.svg";
import { useEffect, useState } from "react";

// 확장된 MainAlbum props 타입 (isActive 추가)
interface EnhancedMainAlbumProps extends MainAlbumProps {
  isActive?: boolean;
}

function MainAlbum({
  title,
  description,
  imageUrl,
  bgColor,
  photoCount,
  isActive = false
}: EnhancedMainAlbumProps) {
  const [imgSrc, setImgSrc] = useState<string>(defaultAlbumImage);

  // 앨범 이미지 URL 체크 함수 - MainPage와 동일한 로직 사용
  const getAlbumImageUrl = (url: string | undefined) => {
    // URL이 비어있거나 유효하지 않은 경우 기본 이미지 반환
    if (!url || url === 'undefined' || url === 'null') {
      return defaultAlbumImage;
    }
    
    // presigned URL 문자열이 포함된 경우 기본 이미지 반환
    if (url.includes('presigned')) {
      return defaultAlbumImage;
    }
    
    // 유효한 URL인 경우 그대로 반환 (추가 파라미터 없이)
    return url;
  };

  // 이미지 로딩 실패 처리
  const handleImageError = () => {
    console.log('Image failed to load, using default image for:', title);
    setImgSrc(defaultAlbumImage);
  };

  // imageUrl이 변경될 때마다 이미지 소스 업데이트
  useEffect(() => {
    if (imageUrl) {
      const processedUrl = getAlbumImageUrl(imageUrl);
      console.log(`Setting image for album "${title}":`, processedUrl);
      setImgSrc(processedUrl);
    } else {
      setImgSrc(defaultAlbumImage);
    }
  }, [imageUrl, title]);

  // 활성화 상태에 따른 스타일 설정
  const containerStyle = {
    // 활성화된 경우 앨범 bgColor 적용, 비활성화된 경우 회색 배경 적용
    backgroundColor: isActive ? bgColor : 'rgba(107, 114, 128, 0.3)', // bg-gray-500/30 동등값
    transform: isActive ? 'scale(1.02)' : 'scale(1)'
  };

  return (
    <div 
      className="relative rounded-[8px] mb-[3px] transition-all duration-200 hover:brightness-95"
      style={containerStyle}
    >
      <div className="relative z-10 p-[10px] flex flex-row">
        {/* 이미지 영역 */}
        <div className="relative w-[150px] h-[150px] rounded-[8px] overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
            alt={title || "앨범 이미지"}
            onError={handleImageError}
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col gap-1 pl-[10px] w-[50%]">
          <p className="text-h4-lg font-p-700 mt-auto">{title || "앨범"}</p>
          <p className="text-p-sm">{description || ""}</p>
          <p className="text-p-lg mt-auto text-right">
            <span className="font-bold">{photoCount || 0}</span>의 순간
          </p>
        </div>
      </div>
      
      {/* 배경 오버레이 (그림자 효과) */}
      <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-[8px]"></div>
    </div>
  );
}

export default MainAlbum;