import { create } from 'zustand';
import { AlbumData } from '@/types/Album';
import albumsData from '@/components/album/AlbumsData.json';

// ??
interface AlbumState {
  albums: AlbumData[];
  activeIndex: number;
  currentAlbum: AlbumData | null;
  wheelCooldown: boolean;
  setActiveIndex: (index: number) => void;
  nextAlbum: () => void;
  previousAlbum: () => void;
  setWheelCooldown: (cooldown: boolean) => void;
}

const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: albumsData,
  activeIndex: 0,
  currentAlbum: albumsData[0],
  wheelCooldown: false,

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
