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

// 앨범 생성 요청 인터페이스
interface CreateAlbumRequest {
  familyId: number;
  albumName: string;
  albumContent: string;
  backgroundColor: string;
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

/**
 * 새 앨범을 생성하는 함수
 */
export const createAlbum = async (albumData: CreateAlbumRequest): Promise<ApiAlbumData> => {
  try {
    const response = await apiClient.post('/api/albums', albumData);
    console.log("앨범 생성 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error('앨범 생성 실패:', error);
    throw error;
  }
};