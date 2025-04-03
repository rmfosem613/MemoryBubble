/**
 * 이미지를 WebP 형식으로 변환하는 유틸리티 함수
 */

/**
 * 이미지 파일을 WebP 형식으로 변환
 * @param file 변환할 이미지 파일
 * @param quality 이미지 품질 (0.0 ~ 1.0)
 * @returns WebP 형식의 Blob Promise
 */
export const convertToWebP = async (file: File, quality: number = 0.95): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');

        // 원본 이미지 크기로 캔버스 설정 (고해상도 유지)
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);

        // WebP 형식으로 변환 (설정된 품질로)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP 변환 실패'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일을 특정 비율로 크롭하고 WebP 형식으로 변환
 * @param file 변환할 이미지 파일
 * @param crop 크롭 정보 (x, y, width, height)
 * @param aspectRatio 비율 (예: 4/3, 1, 3/4)
 * @param quality 이미지 품질 (0.0 ~ 1.0)
 * @returns WebP 형식의 Blob Promise
 */
export const cropAndConvertToWebP = async (
  file: File, 
  crop: {x: number, y: number, width: number, height: number},
  aspectRatio: number = 1,
  quality: number = 0.95
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // 원본 이미지의 실제 크롭 영역 계산
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        
        const pixelCrop = {
          x: crop.x * scaleX,
          y: crop.y * scaleY,
          width: crop.width * scaleX,
          height: crop.height * scaleY
        };
        
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
          return;
        }
        
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        
        // WebP 형식으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP 변환 실패'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 크기 유효성 검사
 * @param file 검사할 이미지 파일
 * @param minSizeKB 최소 크기 (KB)
 * @param maxSizeMB 최대 크기 (MB)
 * @returns 검사 결과 및 오류 메시지
 */
export const validateImageSize = (
  file: File,
  minSizeKB: number = 100,
  maxSizeMB: number = 3
): {valid: boolean, message: string} => {
  const minSizeBytes = minSizeKB * 1024; // KB를 바이트로 변환
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // MB를 바이트로 변환

  if (file.size < minSizeBytes) {
    return {
      valid: false, 
      message: `이미지 크기가 너무 작습니다. 최소 ${minSizeKB}KB 이상이어야 합니다.`
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false, 
      message: `이미지 크기가 너무 큽니다. 최대 ${maxSizeMB}MB 이하여야 합니다.`
    };
  }

  return {valid: true, message: ''};
};

/**
 * 이미지 파일을 4:3 또는 3:4 비율로 자르고 WebP로 변환
 * @param file 변환할 이미지 파일
 * @param isLandscape true면 4:3, false면 3:4 비율
 * @param quality 이미지 품질 (0.0 ~ 1.0)
 * @returns WebP 형식의 Blob Promise
 */
export const cropToRatioAndConvertToWebP = async (
  file: File,
  isLandscape: boolean = true,
  quality: number = 0.95
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const aspectRatio = isLandscape ? 4/3 : 3/4;
        
        let cropWidth, cropHeight, startX, startY;
        
        if ((img.width / img.height) > aspectRatio && isLandscape) {
          // 이미지가 비율보다 더 넓은 경우
          cropHeight = img.height;
          cropWidth = cropHeight * aspectRatio;
          startY = 0;
          startX = (img.width - cropWidth) / 2;
        } else if ((img.width / img.height) < aspectRatio && isLandscape) {
          // 이미지가 비율보다 더 좁은 경우
          cropWidth = img.width;
          cropHeight = cropWidth / aspectRatio;
          startX = 0;
          startY = (img.height - cropHeight) / 2;
        } else if ((img.width / img.height) > (1/aspectRatio) && !isLandscape) {
          // 세로 모드에서 이미지가 비율보다 더 넓은 경우
          cropHeight = img.height;
          cropWidth = cropHeight * (1/aspectRatio);
          startY = 0;
          startX = (img.width - cropWidth) / 2;
        } else {
          // 세로 모드에서 이미지가 비율보다 더 좁은 경우
          cropWidth = img.width;
          cropHeight = cropWidth * aspectRatio;
          startX = 0;
          startY = (img.height - cropHeight) / 2;
        }
        
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
          return;
        }
        
        ctx.drawImage(
          img,
          startX, startY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        );
        
        // WebP 형식으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('WebP 변환 실패'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};