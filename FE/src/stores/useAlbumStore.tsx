import { create } from 'zustand';
import { AlbumData } from '@/types/Album';
import { fetchAlbums } from '@/apis/albumApi';

// 앨범 상태 관리 인터페이스
interface AlbumState {
  albums: AlbumData[];
  activeIndex: number;
  currentAlbum: AlbumData | null;
  wheelCooldown: boolean;
  isLoading: boolean;
  error: string | null;
  setActiveIndex: (index: number) => void;
  nextAlbum: () => void;
  previousAlbum: () => void;
  setWheelCooldown: (cooldown: boolean) => void;
  fetchAlbumsData: () => Promise<void>;
}

const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  activeIndex: 0,
  currentAlbum: null,
  wheelCooldown: false,
  isLoading: false,
  error: null,

  fetchAlbumsData: async () => {
    set({ isLoading: true, error: null });
    try {
      const albumsData = await fetchAlbums();
      
      // API 응답을 AlbumData 형식으로 변환
      const formattedAlbums: AlbumData[] = albumsData.map((album) => ({
        id: album.albumId,
        title: album.albumName,
        description: album.albumContent,
        imageUrl: album.thumbnailUrl,
        bgColor: album.backgroundColor,
        photoCount: `${album.photoLength}장의 순간`
      }));
      
      set({ 
        albums: formattedAlbums,
        currentAlbum: formattedAlbums.length > 0 ? formattedAlbums[0] : null,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
      set({ 
        error: '앨범을 불러오는 중 오류가 발생했습니다.',
        isLoading: false 
      });
    }
  },

  setActiveIndex: (index) => set(state => {
    const newIndex = Math.max(0, Math.min(index, state.albums.length - 1));
    return {
      activeIndex: newIndex,
      currentAlbum: state.albums[newIndex]
    };
  }),

  nextAlbum: () => {
    const { activeIndex, albums, wheelCooldown } = get();
    if (activeIndex < albums.length - 1 && !wheelCooldown) {
      set({ wheelCooldown: true });
      set(state => ({
        activeIndex: state.activeIndex + 1,
        currentAlbum: state.albums[state.activeIndex + 1]
      }));
      setTimeout(() => set({ wheelCooldown: false }), 500);
    }
  },

  previousAlbum: () => {
    const { activeIndex, wheelCooldown } = get();
    if (activeIndex > 0 && !wheelCooldown) {
      set({ wheelCooldown: true });
      set(state => ({
        activeIndex: state.activeIndex - 1,
        currentAlbum: state.albums[state.activeIndex - 1]
      }));
      setTimeout(() => set({ wheelCooldown: false }), 500);
    }
  },

  setWheelCooldown: (cooldown) => set({ wheelCooldown: cooldown }),
}));

export default useAlbumStore;