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

/**
 * 이미지 파일을 다운샘플링하여 미리보기용 이미지와 메타데이터를 생성합니다.
 * @param file 원본 이미지 파일
 * @param maxWidth 최대 너비 (픽셀)
 * @param maxHeight 최대 높이 (픽셀)
 * @param quality JPEG 품질 (0-1)
 * @returns 다운샘플링된 이미지 Blob과 메타데이터
 */
export const createDownsampledImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<{
  file: File;
  blob: Blob;
  width: number;
  height: number;
  preview: string;
  originalFile: File;
}> => {
  return new Promise((resolve, reject) => {
    // 파일 읽기
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // 메모리 해제
        URL.revokeObjectURL(img.src);

        // 원본 크기 저장
        const originalWidth = img.width;
        const originalHeight = img.height;

        // 새 크기 계산
        let width = originalWidth;
        let height = originalHeight;

        // 최대 크기 초과 시 비율 유지하며 리사이징
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // 캔버스 생성
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다'));
          return;
        }

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);

        // 이미지 생성 및 반환
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Blob을 생성할 수 없습니다'));
            return;
          }

          // 미리보기 URL 생성
          const previewUrl = URL.createObjectURL(blob);

          // 다운샘플링된 파일 생성
          const downsampledFile = new File(
            [blob],
            file.name,
            { type: 'image/jpeg' } // 미리보기는 JPEG으로 통일
          );

          resolve({
            file: downsampledFile,
            blob,
            width,
            height,
            preview: previewUrl,
            originalFile: file
          });
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        reject(new Error('이미지 로드 실패'));
      };

      // 이미지 로드
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * 원본 이미지에 크롭을 적용하고 업로드용으로 최적화합니다.
 * @param originalFile 원본 파일
 * @param previewWidth 미리보기 이미지 너비
 * @param previewHeight 미리보기 이미지 높이
 * @param cropData 크롭 데이터 (x, y, width, height)
 * @param maxWidth 최대 출력 너비
 * @param maxHeight 최대 출력 높이
 * @param quality 출력 품질 (0-1)
 * @returns 최적화된 크롭 이미지 File
 */
export const applyOriginalCrop = (
  originalFile: File,
  previewWidth: number,
  previewHeight: number,
  cropData: { x: number; y: number; width: number; height: number },
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // 메모리 해제
        URL.revokeObjectURL(img.src);

        // 원본과 미리보기 크기 비율 계산
        const scaleFactor = img.width / previewWidth;

        // 원본 이미지 기준 크롭 영역 계산
        const scaledCrop = {
          x: cropData.x * scaleFactor,
          y: cropData.y * scaleFactor,
          width: cropData.width * scaleFactor,
          height: cropData.height * scaleFactor
        };

        // 최종 출력 크기 계산
        let finalWidth = scaledCrop.width;
        let finalHeight = scaledCrop.height;

        // 최대 크기 초과 시 비율 유지하며 리사이징
        if (finalWidth > maxWidth || finalHeight > maxHeight) {
          const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight);
          finalWidth = Math.floor(finalWidth * ratio);
          finalHeight = Math.floor(finalHeight * ratio);
        }

        // 캔버스 생성
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다'));
          return;
        }

        // 크롭 및 리사이징 적용
        ctx.drawImage(
          img,
          scaledCrop.x,
          scaledCrop.y,
          scaledCrop.width,
          scaledCrop.height,
          0, 0,
          finalWidth,
          finalHeight
        );

        // 최종 이미지 생성
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Blob을 생성할 수 없습니다'));
            return;
          }

          // 동일한 파일명 유지하고 타입만 변경
          resolve(new File([blob], originalFile.name, {
            type: originalFile.type // 원본 타입 유지 또는 'image/webp'로 변경 가능
          }));
        }, originalFile.type, quality);
      };

      img.onerror = () => {
        reject(new Error('이미지 로드 실패'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsDataURL(originalFile);
  });
};

/**
 * 이미지 크롭 작업을 위한 메타데이터를 저장합니다.
 * 미리보기 최적화 및 원본 크롭 작업에 필요한 정보를 관리합니다.
 */
export interface ImageProcessingMetadata {
  originalFile: File;
  previewFile: File;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  processedFile?: File;
}