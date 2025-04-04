import { useEffect, useRef } from 'react';
import useAlbumStore from '@/stores/useAlbumStore';

export default function useAlbumNavigation() {
  const { nextAlbum, previousAlbum } = useAlbumStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // wheel 이벤트를 DOM API로 직접 처리
  useEffect(() => {
    const element = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0) {
        nextAlbum();
      } else {
        previousAlbum();
      }
    };

    if (element) {
      // wheel 이벤트에 대해 passive: false 옵션 명시
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, [nextAlbum, previousAlbum]);

  // 키보드 이벤트 처리
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

  return { containerRef };
}
