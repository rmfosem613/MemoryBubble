import { AlbumData } from '../types/Album';

/**
 * 현재 보여질 앨범들 결정 (첫 번째 또는 마지막 항목일 경우 특별 처리)
 */
export function getVisibleAlbums(albums: AlbumData[], activeIndex: number): AlbumData[] {
  if (albums.length === 0) {
    return [];
  }
  
  // 앨범이 한 개뿐인 경우
  if (albums.length === 1) {
    return [albums[0]];
  }
  
  // 첫 번째 앨범이 활성화된 경우
  if (activeIndex === 0) {
    return [
      albums[0],
      ...(albums.length > 1 ? [albums[1]] : [])  // 두 번째 앨범이 있을 경우만 추가
    ];
  }
  // 마지막 앨범이 활성화된 경우
  else if (activeIndex === albums.length - 1) {
    return [
      albums[activeIndex - 1], // 마지막 이전 앨범
      albums[activeIndex]      // 마지막 앨범 (활성화)
    ];
  }
  // 그 외의 경우 (3개 항목 표시)
  else {
    return [
      albums[activeIndex - 1], // 이전 앨범
      albums[activeIndex],     // 현재 앨범 (활성화)
      albums[activeIndex + 1]  // 다음 앨범
    ];
  }
}

/**
 * 앨범 위치 및 스타일 결정 함수
 */
export function getAlbumStyle(activeIndex: number, totalAlbums: number, index: number): string {
  // 앨범이 한 개뿐인 경우
  if (totalAlbums === 1) {
    return 'scale-100 opacity-100 z-20'; // 활성화/중앙
  }
  
  // 첫 번째 앨범이 활성화된 경우
  if (activeIndex === 0) {
    return index === 0
      ? 'scale-100 opacity-100 z-20' // 첫 번째 앨범 (활성화/중앙)
      : 'scale-95 opacity-80 z-10';  // 두 번째 앨범 (아래)
  }
  // 마지막 앨범이 활성화된 경우
  else if (activeIndex === totalAlbums - 1) {
    return index === 0
      ? 'scale-95 opacity-80 z-10'     // 마지막 이전 앨범 (위)
      : 'scale-100 opacity-100 z-20';  // 마지막 앨범 (활성화/중앙)
  }
  // 그 외의 경우 (3개 항목)
  else {
    if (index === 0) return 'scale-95 opacity-80 z-10';      // 위 항목
    if (index === 1) return 'scale-100 opacity-100 z-20';    // 중앙 항목 (활성화)
    return 'scale-95 opacity-80 z-10';                       // 아래 항목
  }
}