import { useEffect } from 'react';
import MainAlbum from './MainAlbum';
import { SlidingAlbumListProps } from '@/types/Album';
import useAlbumStore from '@/stores/useAlbumStore';
import useAlbumNavigation from '@/hooks/useAlbumNavigation';
import { getVisibleAlbums, getAlbumStyle } from '@/utils/albumUtils';

function SlidingAlbumList({ onAlbumChange }: SlidingAlbumListProps) {
  // 상태관리 스토어에서 데이터 가져오기
  const { albums, activeIndex, currentAlbum } = useAlbumStore();
  
  // 네비게이션 훅에서 이벤트 핸들러 가져오기
  const { handleWheel } = useAlbumNavigation();
  
  // 활성화된 앨범이 변경될 때마다 부모에게 알림 (이전 코드와 호환성 유지)
  useEffect(() => {
    if (onAlbumChange && currentAlbum) {
      onAlbumChange(currentAlbum);
    }
  }, [currentAlbum, onAlbumChange]);
  
  // 현재 보여질 앨범들
  const visibleAlbums = getVisibleAlbums(albums, activeIndex);
  
  return (
    <div
      className="w-[400px] h-screen z-30 absolute top-0 right-0 flex flex-col justify-center"
      onWheel={handleWheel}
    >
      {/* 상단 여백 */}
      <div className="h-[65px] absolute top-0 left-0 right-0"></div>

      {/* 앨범 슬라이더 */}
      <div className="flex-1 flex flex-col justify-center items-center relative">
        {/* 앨범 목록 */}
        <div className="w-full transition-all duration-300 flex flex-col items-center">
          {visibleAlbums.map((album, index) => (
            <div
              key={album.id}
              className={`transition-all duration-300 transform w-full ${getAlbumStyle(activeIndex, albums.length, index)}`}
            >
              <MainAlbum
                title={album.title}
                description={album.description}
                imageUrl={album.imageUrl}
                bgColor={album.bgColor}
                photoCount={album.photoCount}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlidingAlbumList;