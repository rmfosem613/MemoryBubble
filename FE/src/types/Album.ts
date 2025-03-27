// MainPage와 MainAlbum에서 Album 정보를 받아오는 인터페이스 정의
export interface AlbumData {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
  photoCount: string;
}

// SlidingAlbumList에서 부모 컴포넌트로 전달할 props 타입 정의
export interface SlidingAlbumListProps {
  onAlbumChange?: (album: AlbumData) => void;
}

// id 제거한 albumData 인터페이스
export type MainAlbumProps = Omit<AlbumData, 'id'>;