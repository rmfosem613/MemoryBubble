import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAlbumStore from '@/stores/useAlbumStore';
import image1 from '/assets/album-1.png';
import image2 from '/assets/album-2.png';
import image3 from '/assets/album-3.png';
import image4 from '/assets/album-4.png';
import image5 from '/assets/album-5.png';

export interface Photo {
  id: number;
  src: string;
  alt: string;
}

export const usePhotoAlbum = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const { id } = useParams();
  const { albums } = useAlbumStore();

  const currentAlbum = id ? albums[Number(id) - 1] : null;

  useEffect(() => {
    const samplePhotos: Photo[] = [
      { id: 1, src: image1, alt: '봄꽃 나들이 사진 1' },
      { id: 2, src: image2, alt: '봄꽃 나들이 사진 2' },
      { id: 3, src: image3, alt: '봄꽃 나들이 사진 3' },
      { id: 4, src: image4, alt: '봄꽃 나들이 사진 4' },
      { id: 5, src: image5, alt: '봄꽃 나들이 사진 5' },
    ];

    setPhotos(samplePhotos);
    setIsLoading(false);
  }, []);

  const handleChangeTitle = () => {
    console.log('앨범 명 수정');
  };

  const handleChangeThumnail = () => {
    console.log('썸네일 수정');
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1,
    );
    setIsFlipped(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1,
    );
    setIsFlipped(false);
  };

  // 키보드 이벤트 처리 (왼쪽/오른쪽 화살표)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length]);

  // 현재 이미지, 이전 이미지, 다음 이미지 인덱스 계산
  const getPrevIndex = () =>
    currentIndex === 0 ? photos.length - 1 : currentIndex - 1;

  const getNextIndex = () =>
    currentIndex === photos.length - 1 ? 0 : currentIndex + 1;

  return {
    isFlipped,
    toggleFlip,
    currentAlbum,
    photos,
    isLoading,
    currentIndex,
    handleChangeTitle,
    handleChangeThumnail,
    getPrevIndex,
    getNextIndex,
    goToPrevious,
    goToNext,
  };
};
