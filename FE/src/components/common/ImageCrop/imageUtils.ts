// 자르기, 변환, 유효성 검사 등 이미지 처리에 필요한 종합 유틸리티


/**
 * 이미지 파일을 WebP 형식으로 변환
 * @param file 변환할 이미지 파일
 * @param quality 이미지 품질 (0.0 ~ 1.0)
 * @returns WebP Blob을 반환하는 Promise
 */
export const convertToWebP = async (file: File, quality: number = 0.95): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');

        // 원본 해상도를 유지하여 고화질 출력
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트 생성 실패'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // 지정한 품질로 WebP 변환
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
 * 이미지를 지정된 영역으로 자른 후 WebP로 변환
 * @param file 자를 이미지 파일
 * @param crop 자를 위치 및 크기 {x, y, width, height}
 * @param quality 출력 품질 (0.0 ~ 1.0)
 * @returns 자른 WebP Blob을 반환하는 Promise
 */
export const cropImageToWebP = async (
  file: File,
  crop: { x: number, y: number, width: number, height: number },
  quality: number = 0.95
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');

        // 원본 이미지 기준으로 자르기 비율 계산
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
          reject(new Error('캔버스 컨텍스트 생성 실패'));
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

        // WebP로 변환
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
 * Blob 데이터를 기반으로 새 파일 생성
 * @param blob 변환된 이미지 Blob
 * @param originalFile 원본 파일 (이름 및 메타데이터 용도)
 * @param format 출력 포맷 (기본값: 'webp')
 * @returns 새로운 File 객체
 */
export const createFileFromBlob = (
  blob: Blob,
  originalFile: File,
  format: string = 'webp'
): File => {
  const extension = format.replace('image/', '');
  const fileName = originalFile.name.replace(/\.[^/.]+$/, `.${extension}`);

  return new File([blob], fileName, {
    type: `image/${format}`,
    lastModified: Date.now()
  });
};

/**
 * 이미지 파일 크기 유효성 검사
 * @param file 검사할 이미지 파일
 * @param minSizeKB 최소 크기 (KB 단위)
 * @param maxSizeMB 최대 크기 (MB 단위)
 * @returns 유효성 여부 및 메시지 반환
 */
export const validateImageSize = (
  file: File,
  minSizeKB: number = 100,
  maxSizeMB: number = 3
): { valid: boolean, message: string } => {
  const minSizeBytes = minSizeKB * 1024;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size < minSizeBytes) {
    return {
      valid: false,
      message: `이미지 용량이 너무 작습니다. 최소 ${minSizeKB}KB 이상이어야 합니다.`
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      message: `이미지 용량이 너무 큽니다. 최대 ${maxSizeMB}MB 이하여야 합니다.`
    };
  }

  return { valid: true, message: '' };
};

/**
 * 지정된 비율로 이미지를 중앙 자르기 ("4:3", "3:4", "1:1")
 * @param file 이미지 파일
 * @param aspectRatio 자를 비율 (기본: "4:3")
 * @param quality 출력 품질 (0.0 ~ 1.0)
 * @returns WebP Blob 반환
 */
export const cropToAspectRatio = async (
  file: File,
  aspectRatio: "4:3" | "3:4" | "1:1" = "4:3",
  quality: number = 0.95
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');

        // 비율 값 계산
        const ratioValue = aspectRatio === "1:1" ? 1 :
          aspectRatio === "4:3" ? 4 / 3 : 3 / 4;

        // 자를 영역 계산
        let cropWidth, cropHeight, startX, startY;

        if ((img.width / img.height) > ratioValue) {
          // 이미지가 비율보다 가로로 김
          cropHeight = img.height;
          cropWidth = cropHeight * ratioValue;
          startY = 0;
          startX = (img.width - cropWidth) / 2;
        } else {
          // 이미지가 비율보다 세로로 김
          cropWidth = img.width;
          cropHeight = cropWidth / ratioValue;
          startX = 0;
          startY = (img.height - cropHeight) / 2;
        }

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트 생성 실패'));
          return;
        }

        ctx.drawImage(
          img,
          startX, startY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        );

        // WebP로 변환
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
 * 사전 서명된 URL을 사용해 S3에 이미지 업로드
 * @param presignedUrl S3 업로드용 사전 서명 URL
 * @param imageBlob 업로드할 이미지 Blob
 * @param contentType 콘텐츠 타입 (기본값: 'image/webp')
 * @returns 업로드 성공 여부를 반환하는 Promise
 */
export const uploadImageToS3 = async (
  presignedUrl: string,
  imageBlob: Blob,
  contentType: string = 'image/webp'
): Promise<boolean> => {
  try {
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: imageBlob,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`업로드 실패: ${uploadResponse.status}`);
    }

    return true;
  } catch (error) {
    console.error('S3 이미지 업로드 실패:', error);
    return false;
  }
};
