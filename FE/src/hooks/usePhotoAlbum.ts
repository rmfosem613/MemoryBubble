import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import useAlbumStore from '@/stores/useAlbumStore';
import apiClient from '@/apis/apiClient';

export interface Photo {
  id: number;
  src: string;
  alt: string;
}

export const usePhotoAlbum = () => {
  const [albumTitle, setAlbumTitle] = useState('앨범 제목');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumContent, setNewAlbumContent] = useState('');

  // 추가: 현재 사진의 메시지 데이터를 저장할 상태
  const [photoMessages, setPhotoMessages] = useState<any[]>([]);

  const [allAlbums, setAllAlbums] = useState<{ id: number; title: string }[]>(
    [],
  );
  const [targetAlbumId, setTargetAlbumId] = useState<number | null>(null);

  const { id } = useParams();
  // const { albums } = useAlbumStore();

  useEffect(() => {
    const fetchAllAlbums = async () => {
      try {
        const response = await apiClient.get('/api/albums');
        console.log('원본 앨범 데이터:', response.data);

        // 데이터 형식 변환
        const formattedAlbums = response.data.map((album: any) => ({
          id: album.albumId,
          title: album.albumName,
        }));

        console.log('변환된 앨범 데이터:', formattedAlbums);
        setAllAlbums(formattedAlbums);
      } catch (error) {
        console.error('앨범 목록 불러오기 실패:', error);
      }
    };

    fetchAllAlbums();
  }, []);

  // 앨범 사진 불러오기
  useEffect(() => {
    const fetchPhotosByAlbumId = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('앨범 ID가 유효하지 않습니다.');
        }

        const response = await apiClient.get(`/api/albums/${id}`);
        console.log('앨범 사진:', response.data);
        setAlbumTitle(response.data.albumName || '앨범 제목'); // 앨범 제목 설정

        // API 응답에서 photoList 배열 추출
        const photoList = response.data.photoList || [];

        if (photoList.length === 0) {
          console.log('앨범에 사진이 없습니다.');
        }

        // Photo 인터페이스에 맞게 데이터 변환
        const formattedPhotos: Photo[] = photoList.map((photo: any) => ({
          id: photo.photoId,
          src: photo.photoUrl,
          alt: `앨범 사진 ${photo.photoId}`,
        }));

        setPhotos(formattedPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setError('사진을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPhotosByAlbumId();
    }
  }, [id]);

  // 사진 이동 핸들러
  const handleMovePhoto = async () => {
    if (!targetAlbumId || photos.length === 0) {
      return;
    }

    try {
      // 현재 선택된 사진의 ID 가져오기
      const photoId = photos[currentIndex].id;

      const data = {
        albumId: targetAlbumId,
        photoList: [photoId],
      };

      console.log(data);

      // API 요청 - 사진 이동
      await apiClient.patch(`/api/albums/${id}/move`, data);

      console.log('사진 이동 성공');

      // 현재 앨범의 사진 목록 다시 가져오기
      if (id) {
        const response = await apiClient.get(`/api/albums/${id}`);

        // API 응답에서 photoList 배열 추출
        const photoList = response.data.photoList || [];

        // Photo 인터페이스에 맞게 데이터 변환
        const formattedPhotos: Photo[] = photoList.map((photo: any) => ({
          id: photo.photoId,
          src: photo.photoUrl,
          alt: `앨범 사진 ${photo.photoId}`,
        }));

        // 사진 목록 업데이트
        setPhotos(formattedPhotos);

        // 인덱스 조정
        if (formattedPhotos.length === 0) {
          // 사진이 없는 경우
          setCurrentIndex(0);
        } else if (currentIndex >= formattedPhotos.length) {
          // 이전 인덱스가 새 배열 범위를 벗어나는 경우
          setCurrentIndex(Math.max(0, formattedPhotos.length - 1));
        }
      }
      setIsFlipped(!isFlipped);
    } catch (error) {
      console.error('사진 이동 실패:', error);
    }
  };

  // 앨범 제목 변경 핸들러
  const handleChangeTitle = async () => {
    try {
      if (!id) {
        throw new Error('앨범 ID가 유효하지 않습니다.');
      }

      // 요청 body 객체 생성
      const data = {
        albumName: newAlbumName || albumTitle, // 새 이름이 없으면 기존 이름 사용
        albumContent: newAlbumContent,
      };

      // API 요청 보내기
      const response = await apiClient.patch(`/api/albums/${id}`, data);

      console.log('앨범 정보 수정 성공:', response.data);

      // 성공 시 로컬 상태 업데이트
      if (newAlbumName) {
        setAlbumTitle(newAlbumName);
      }

      // 입력 필드 초기화
      setNewAlbumName('');
      setNewAlbumContent('');
    } catch (error) {
      console.error('앨범 정보 수정 실패:', error);
    }
  };
  // 썸네일 변경 핸들러
  const handleChangeThumnail = async () => {
    try {
      const photoId = photos[currentIndex].id;
      const data = {
        photoId: photoId,
      };

      const response = await apiClient.patch(
        `/api/albums/${id}/thumbnail`,
        data,
      );

      console.log('썸네일 변경 성공:', response.data);
    } catch (error) {
      console.error('썸네일 변경 실패:', error);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // 카드 뒤집기 토글(axios 요청 포함)
  const toggleFlipWithPostCard = async () => {
    const currentPhotoId = photos[currentIndex].id;
    try {
      const response = await apiClient.get(`/api/photos/${currentPhotoId}`);
      console.log(response.data);
      // 받아온 메시지 데이터를 상태에 저장
      if (response.data && Array.isArray(response.data)) {
        setPhotoMessages(response.data);
      } else {
        // 데이터 형식이 다른 경우 빈 배열로 초기화
        setPhotoMessages([]);
      }
    } catch (error) {
      console.error('Error fetching postcards:', error);
    }
    console.log('현재 클릭한 사진 ID:', currentPhotoId);
    setIsFlipped(!isFlipped);
  };

  // 이전 사진으로 이동
  const goToPrevious = () => {
    if (photos.length === 0) return;

    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1,
    );
    setIsFlipped(false);
  };

  // 다음 사진으로 이동
  const goToNext = () => {
    if (photos.length === 0) return;

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
  const getPrevIndex = () => {
    if (photos.length === 0) return 0;
    return currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
  };

  const getNextIndex = () => {
    if (photos.length === 0) return 0;
    return currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
  };

  // 앨범 사진 목록 새로고침 함수
  const refreshPhotos = async () => {
    try {
      if (!id) {
        throw new Error('앨범 ID가 유효하지 않습니다.');
      }

      const response = await apiClient.get(`/api/albums/${id}`);
      console.log('앨범 사진 새로고침:', response.data);

      // API 응답에서 photoList 배열 추출
      const photoList = response.data.photoList || [];

      // Photo 인터페이스에 맞게 데이터 변환
      const formattedPhotos: Photo[] = photoList.map((photo: any) => ({
        id: photo.photoId,
        src: photo.photoUrl,
        alt: `앨범 사진 ${photo.photoId}`,
      }));

      setPhotos(formattedPhotos);
    } catch (error) {
      console.error('사진 목록 새로고침 실패:', error);
    }
  };

  return {
    albumTitle,
    newAlbumName,
    setNewAlbumName,
    newAlbumContent,
    setNewAlbumContent,
    isFlipped,
    toggleFlip,
    toggleFlipWithPostCard,
    // currentAlbum,
    photos,
    photoMessages,
    setPhotoMessages,
    isLoading,
    error,
    currentIndex,
    handleChangeTitle,
    handleChangeThumnail,
    getPrevIndex,
    getNextIndex,
    goToPrevious,
    goToNext,
    allAlbums,
    targetAlbumId,
    setTargetAlbumId,
    handleMovePhoto,
    albumId: id, // 현재 앨범 ID 반환
    refreshPhotos,
  };
};
