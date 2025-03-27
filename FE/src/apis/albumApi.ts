import apiClient from './apiClient';

// 앨범 API 호출을 위한 함수
interface ApiAlbumData {
  albumId: number;
  albumName: string;
  albumContent: string;
  thumbnailUrl: string;
  backgroundColor: string;
  photoLength: number;
}

/**
 * 서버에서 앨범 목록을 가져오는 함수
 */
export const fetchAlbums = async (): Promise<ApiAlbumData[]> => {
  try {
    // name 파라미터를 params 객체로 전달
    const response = await apiClient.get('/api/albums', {
      params: { name: '' }
    });
    
    console.log("앨범정보 : ", response.data);
    return response.data;
  } catch (error) {
    console.error('앨범 데이터 가져오기 실패:', error);
    throw error;
  }
};