import { useEffect } from 'react';
import useAlbumStore from '../stores/useAlbumStore';

export default function useAlbumNavigation() {
  const { nextAlbum, previousAlbum } = useAlbumStore();
  
  // Handle wheel events
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // 기본 스크롤 동작 방지
    
    if (e.deltaY > 0) {
      nextAlbum();
    } else {
      previousAlbum();
    }
  };
  
  // Handle keyboard events (위/아래 화살표 키)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        nextAlbum();
      } else if (e.key === 'ArrowUp') {
        previousAlbum();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextAlbum, previousAlbum]);
  
  return { handleWheel };
}