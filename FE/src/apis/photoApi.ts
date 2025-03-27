import apiClient from './apiClient';

/**
 * 앨범의 썸네일 이미지를 변경하는 함수
 * @param albumId 앨범 ID
 * @param photoId 썸네일로 설정할 사진 ID
 * @returns 성공 여부
 */
export const updateAlbumThumbnail = async (albumId: number, photoId: number): Promise<boolean> => {
  try {
    const response = await apiClient.patch(`/api/albums/${albumId}/thumbnail`, 
      { photoId }, 
      { params: { albumId } }
    );
    console.log("썸네일 변경 성공:", response.data);
    return true;
  } catch (error) {
    console.error('썸네일 변경 실패:', error);
    throw error;
  }
};

// 앨범 상세 정보 응답 인터페이스
interface AlbumDetailResponse {
  albumName: string;
  photoList: {
    photoId: number;
    photoUrl: string;
  }[];
}

/**
 * 특정 앨범의 상세 정보를 가져오는 함수
 * @param albumId 앨범 ID
 * @returns 앨범 상세 정보
 */
export const getAlbumDetail = async (albumId: number): Promise<AlbumDetailResponse> => {
  try {
    const response = await apiClient.get(`/api/albums/${albumId}`, {
      params: { albumId }
    });
    console.log("앨범 상세 정보:", response.data);
    return response.data;
  } catch (error) {
    console.error('앨범 상세 정보 요청 실패:', error);
    throw error;
  }
};

/**
 * 기본 앨범(추억보관함)의 사진 목록을 가져오는 함수
 * 첫 번째 앨범의 ID를 사용하여 상세 정보를 가져옴
 * @returns 첫 번째 앨범의 상세 정보 및 사진 목록
 */
export const getBasicAlbumPhotos = async (): Promise<AlbumDetailResponse> => {
  try {
    // 모든 앨범 목록을 가져와서 첫 번째 앨범의 ID를 얻음
    const albums = await apiClient.get('/api/albums', {
      params: { name: '' }
    });
    
    if (!albums.data || albums.data.length === 0) {
      throw new Error('앨범 목록이 비어있습니다.');
    }
    
    // 첫 번째 앨범의 ID를 사용하여 상세 정보 요청
    const firstAlbumId = albums.data[0].albumId;
    return await getAlbumDetail(firstAlbumId);
  } catch (error) {
    console.error('기본 앨범 데이터 가져오기 실패:', error);
    throw error;
  }
};

// 사진 업로드 요청 및 응답 인터페이스
interface PresignedUrlResponse {
  presignedUrl: string;
  fileName: string;
}

interface PhotoUploadRequest {
  albumId: number;
  photoLength: number;
}

/**
 * 사진 업로드를 위한 Presigned URL을 요청하는 함수
 * @param payload 앨범 ID와 사진 개수 정보
 * @returns 사진 업로드를 위한 Presigned URL 배열
 */
export const getPhotoUploadUrls = async (payload: PhotoUploadRequest): Promise<PresignedUrlResponse[]> => {
  try {
    const response = await apiClient.post('/api/photos', payload);
    console.log("사진 업로드 URL 획득:", response.data);
    return response.data;
  } catch (error) {
    console.error('사진 업로드 URL 요청 실패:', error);
    throw error;
  }
};

/**
 * 이미지를 WebP 형식으로 변환하는 함수
 * @param file 변환할 이미지 파일
 * @returns WebP 형식의 Blob 객체 Promise
 */
export const convertToWebP = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context 생성 실패'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        // WebP 형식으로 변환 (품질 0.9)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP 변환 실패'));
            }
          },
          'image/webp',
          0.9
        );
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};

/**
 * Presigned URL을 사용하여 이미지를 S3에 업로드하는 함수
 * @param presignedUrl S3 업로드용 Presigned URL
 * @param imageBlob 업로드할 이미지 Blob
 * @returns 업로드 성공 여부
 */
export const uploadImageToS3 = async (presignedUrl: string, imageBlob: Blob): Promise<boolean> => {
  try {
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: imageBlob,
      headers: {
        'Content-Type': 'image/webp',
      },
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('S3 이미지 업로드 실패:', error);
    return false;
  }
};