import { useEffect } from 'react';
import MainAlbum from './MainAlbum';
import { SlidingAlbumListProps } from '@/types/Album';
import useAlbumStore from '@/stores/useAlbumStore';
import useAlbumNavigation from '@/hooks/useAlbumNavigation';
import { getVisibleAlbums, getAlbumStyle } from '@/utils/albumUtils';
import { useNavigate } from 'react-router-dom';

function SlidingAlbumList({ onAlbumChange }: SlidingAlbumListProps) {
  // 상태관리 스토어에서 데이터 가져오기
  const { albums, activeIndex, currentAlbum, setActiveIndex } = useAlbumStore();

  // 네비게이션 훅에서 이벤트 핸들러 가져오기
  const { containerRef } = useAlbumNavigation();

  // 라우터 네비게이션
  const navigate = useNavigate();

  // 활성화된 앨범이 변경될 때마다 부모에게 알림 (이전 코드와 호환성 유지)
  useEffect(() => {
    if (onAlbumChange && currentAlbum) {
      onAlbumChange(currentAlbum);
    }
  }, [currentAlbum, onAlbumChange]);

  // 앨범이 없는 경우 렌더링하지 않음
  if (albums.length === 0) {
    return null;
  }

  // 앨범 클릭 이벤트 핸들러
  const handleAlbumClick = (index: number) => {
    // 현재 보여지는 앨범의 실제 인덱스를 계산
    let actualIndex;

    // 앨범이 3개 이하인 경우
    if (albums.length <= 3) {
      // 클릭한 앨범의 id로 실제 인덱스 찾기
      actualIndex = albums.findIndex(
        (album) => album.id === visibleAlbums[index].id,
      );
    }
    // 첫 번째 앨범이 활성화된 경우
    else if (activeIndex === 0) {
      actualIndex = index; // 0, 1, 또는 2
    }
    // 마지막 앨범이 활성화된 경우
    else if (activeIndex === albums.length - 1) {
      // 마지막 앨범에서는 2개 앞의 앨범부터 시작하여 인덱스 계산
      actualIndex = activeIndex - 2 + index;
    }
    // 그 외의 경우 (중간 앨범 활성화)
    else {
      actualIndex = activeIndex - 1 + index; // 이전, 현재, 다음
    }

    // 사용자가 현재 활성화된 앨범을 클릭한 경우 (해당 앨범 페이지로 이동)
    if (actualIndex === activeIndex) {
      // 첫 번째 앨범(인덱스 0)인 경우 BasicPhotoAlbumPage로, 그 외에는 PhotoAlbumPage로 이동
      if (actualIndex === 0) {
        navigate('/album/basic');
      } else {
        navigate(`/album/${albums[actualIndex].id}`);
      }
    }
    // 사용자가 비활성화된 앨범을 클릭한 경우 (해당 앨범을 활성화만 함)
    else {
      // 앨범 인덱스 업데이트
      setActiveIndex(actualIndex);
    }
  };

  // 현재 보여질 앨범들
  const visibleAlbums = getVisibleAlbums(albums, activeIndex);

  // 각 앨범이 활성화된 앨범인지 확인하는 함수
  const isActiveAlbum = (index: number): boolean => {
    // 앨범이 3개 이하인 경우
    if (albums.length <= 3) {
      // 현재 렌더링되는 앨범의 id가 활성화된 앨범의 id와 일치하는지 확인
      return albums[activeIndex].id === visibleAlbums[index].id;
    }
    // 첫 번째 앨범이 활성화된 경우
    else if (activeIndex === 0) {
      return index === 0; // 첫 번째 항목이 활성화됨
    }
    // 마지막 앨범이 활성화된 경우
    else if (activeIndex === albums.length - 1) {
      return index === 2; // 세 번째 항목이 활성화됨
    }
    // 그 외의 경우 (중간 앨범 활성화)
    else {
      return index === 1; // 두 번째 항목이 활성화됨
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-[330px] z-40 top-0 right-0 flex flex-col justify-center">
      {/* 상단 여백 */}
      <div className="h-[65px] absolute top-0 left-0 right-0"></div>

      {/* 앨범 슬라이더 */}
      <div className="flex-1 flex flex-col justify-center items-center relative">
        {/* 앨범 목록 */}
        <div className="w-full transition-all duration-300 flex flex-col items-center">
          {visibleAlbums.map((album, index) => (
            <div
              key={album.id}
              className={`transition-all duration-300 transform w-full ${getAlbumStyle(activeIndex, albums.length, index)} cursor-pointer`}
              onClick={() => handleAlbumClick(index)}>
              <MainAlbum
                title={album.title}
                description={album.description}
                imageUrl={album.imageUrl}
                bgColor={album.bgColor}
                photoCount={album.photoCount}
                isActive={isActiveAlbum(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlidingAlbumList;
