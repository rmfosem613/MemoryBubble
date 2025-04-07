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
  
  // 3개 이하의 앨범이 있는 경우 모두 표시
  if (albums.length <= 3) {
    return [...albums];
  }
  
  // 첫 번째 앨범이 활성화된 경우
  if (activeIndex === 0) {
    return [
      albums[0],
      albums[1],
      ...(albums.length > 2 ? [albums[2]] : [])
    ];
  }
  // 마지막 앨범이 활성화된 경우
  else if (activeIndex === albums.length - 1) {
    return [
      albums[activeIndex - 2], // 마지막에서 2번째 이전 앨범
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
  
  // 3개 이하의 앨범이 있는 경우
  if (totalAlbums <= 3) {
    // 첫 번째 앨범이 활성화된 경우
    if (activeIndex === 0) {
      if (index === 0) return 'scale-100 opacity-100 z-20'; // 첫 번째 앨범 (활성화)
      return 'scale-90 opacity-80 z-10'; // 나머지 앨범
    }
    // 두 번째 앨범이 활성화된 경우
    else if (activeIndex === 1) {
      if (index === 1) return 'scale-100 opacity-100 z-20'; // 두 번째 앨범 (활성화)
      return 'scale-90 opacity-80 z-10'; // 나머지 앨범
    }
    // 세 번째 앨범이 활성화된 경우
    else if (activeIndex === 2) {
      if (index === 2) return 'scale-100 opacity-100 z-20'; // 세 번째 앨범 (활성화)
      return 'scale-90 opacity-80 z-10'; // 나머지 앨범
    }
  }
  
  // 3개 이상의 앨범이 있는 경우 (기존 로직 유지)
  // 첫 번째 앨범이 활성화된 경우
  if (activeIndex === 0) {
    return index === 0
      ? 'scale-100 opacity-100 z-20' // 첫 번째 앨범 (활성화/중앙)
      : 'scale-90 opacity-80 z-10';  // 두 번째 앨범 (아래)
  }
  // 마지막 앨범이 활성화된 경우
  else if (activeIndex === totalAlbums - 1) {
    return index === 2
      ? 'scale-100 opacity-100 z-20'  // 마지막 앨범 (활성화/중앙)
      : 'scale-90 opacity-80 z-10';   // 나머지 앨범
  }
  // 그 외의 경우 (3개 항목)
  else {
    if (index === 1) return 'scale-100 opacity-100 z-20';    // 중앙 항목 (활성화)
    return 'scale-90 opacity-80 z-10';                       // 위/아래 항목
  }
}