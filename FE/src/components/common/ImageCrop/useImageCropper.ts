import { useState, useRef, useCallback, useEffect } from 'react';
import { type Crop as LibCrop } from 'react-image-crop';

import Alert from '../Alert';

// 확장된 Crop 인터페이스 정의
interface Crop extends LibCrop {
  aspect?: number;
}

// 비율 옵션 타입
export type AspectRatioOption = "1:1" | "4:3" | "3:4";

// 이미지 처리 결과 인터페이스
export interface ImageCropResult {
  file: File | null;
  previewUrl: string | null;
}

// Hook 매개변수 인터페이스
interface UseImageCropperParams {
  initialImage?: File | null;
  initialPreviewUrl?: string | null;
  allowedAspectRatios?: AspectRatioOption[];
  defaultAspectRatio?: AspectRatioOption;
  minSize?: number; // 최소 크기 (KB)
  maxSize?: number; // 최대 크기 (MB)
  imageQuality?: number; // 이미지 품질 (0.0 ~ 1.0)
  maxAspectRatioDifference?: number; // 최대 가로세로 비율 차이
}

const useImageCropper = ({
  initialImage = null,
  initialPreviewUrl = null,
  allowedAspectRatios = ["1:1", "4:3", "3:4"],
  defaultAspectRatio = "1:1",
  minSize = 100, // 기본 최소 100KB
  maxSize = 10, // 기본 최대 10MB
  imageQuality = 0.95, // 기본 품질 95%
  maxAspectRatioDifference = 20 // 기본 최대 비율 차이 20배
}: UseImageCropperParams = {}) => {
  // 상태 관리
  const [image, setImage] = useState<File | null>(initialImage);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(defaultAspectRatio);
  const [crop, setCrop] = useState<Crop>(getInitialCrop(defaultAspectRatio));
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [error, setError] = useState<string>("");

  // 중복 클릭 방지를 위한 디바운싱 처리용 ref
  const isProcessingRatio = useRef<boolean>(false);

  // 참조 객체
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imageLoaded = useRef<boolean>(false);

  // 비율에 따른 초기 crop 객체 생성 함수
  function getInitialCrop(ratio: AspectRatioOption): Crop {
    const aspectMap = {
      "1:1": 1,
      "4:3": 4 / 3,
      "3:4": 3 / 4
    };

    return {
      unit: '%',
      width: 30,
      height: 30 / aspectMap[ratio],
      x: 0,
      y: 0,
      aspect: aspectMap[ratio]
    } as Crop;
  }

  useEffect(() => {
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl);
      setShowCropper(false);
    }
  }, [initialPreviewUrl]);
  
  // 이미지 크기 유효성 검사 함수
  const validateImageSize = (file: File): boolean => {
    const minSizeBytes = minSize * 1024; // KB를 바이트로 변환
    const maxSizeBytes = maxSize * 1024 * 1024; // MB를 바이트로 변환

    if (file.size < minSizeBytes) {
      setError(`이미지 크기가 너무 작습니다. 최소 ${minSize}KB 이상이어야 합니다.`);
      return false;
    }

    if (file.size > maxSizeBytes) {
      setError(`이미지 크기가 너무 큽니다. 최대 ${maxSize}MB 이하여야 합니다.`);
      return false;
    }

    setError("");
    return true;
  };

  // 이미지 가로세로 비율 검사 함수
  const validateAspectRatio = (width: number, height: number): boolean => {
    const ratio = width / height;
    
    if (ratio >= maxAspectRatioDifference || ratio <= 1/maxAspectRatioDifference) {
      setError(`이미지가 너무 길어서 업로드할 수 없습니다.`);
      return false;
    }
    
    setError("");
    return true;
  };

  // 이미지 선택 시 실행되는 함수
  const handleImageSelect = (file: File): void => {
    if (file.type.startsWith('image/')) {
      // 이미지 크기 검증
      if (!validateImageSize(file)) {
        return;
      }

      // 이미지 비율 검증을 위해 이미지 로드
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src); // 메모리 누수 방지
        
        // 이미지 가로세로 비율 검증
        if (!validateAspectRatio(img.width, img.height)) {
          return;
        }
        
        // 미리보기 생성
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const previewResult = event.target?.result as string;
          setPreviewUrl(previewResult);
          // 기본 비율 설정
          setSelectedRatio(defaultAspectRatio);
          setCrop(getInitialCrop(defaultAspectRatio));
          // 이미지 로드 상태 초기화
          imageLoaded.current = false;
          // 크롭 화면 보여주기
          setShowCropper(true);
        };
        fileReader.readAsDataURL(file);

        // 이미지 파일 저장
        setImage(file);
      };
      
      img.onerror = () => {
        setError("이미지를 로드하는 데 실패했습니다.");
      };
      
      img.src = URL.createObjectURL(file);
    } else {
      setError("이미지 파일만 선택 가능합니다.");
    }
  };

  // 파일 입력 필드 클릭 이벤트 핸들러
  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // 파일 입력 변경 이벤트 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  // 드래그 허용
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  // 파일 드롭
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  // 이미지 크롭 완료 시 실행되는 함수
  const handleCropComplete = (crop: Crop): void => {
    setCompletedCrop(crop);
  };

  // 비율 변경 핸들러 (useCallback으로 래핑하고 디바운싱 로직 추가)
  const handleRatioChange = useCallback((ratio: AspectRatioOption): void => {
    // 이미 처리 중인 경우 중복 호출 방지
    if (isProcessingRatio.current || ratio === selectedRatio) {
      return;
    }

    // 처리 중임을 표시
    isProcessingRatio.current = true;

    const aspectMap = {
      "1:1": 1,
      "4:3": 4 / 3,
      "3:4": 3 / 4
    };

    // 비율 설정과 crop 업데이트를 한 번에 처리
    setSelectedRatio(ratio);

    const newCrop = {
      ...crop,
      aspect: aspectMap[ratio]
    } as Crop;

    setCrop(newCrop);

    // 이미지가 로드되었으면 crop 영역 재설정
    if (imgRef.current) {
      handleResetCropWithRatio(ratio);
    }

    // 중복 클릭 방지를 위한 타이머 설정 (300ms 후 처리 가능 상태로 변경)
    setTimeout(() => {
      isProcessingRatio.current = false;
    }, 300);
  }, [selectedRatio, crop]);

  // 특정 비율로 crop 영역 재설정하는 함수 (비율 변경 시 호출되는 별도 함수)
  const handleResetCropWithRatio = (ratio: AspectRatioOption): void => {
    const aspectMap = {
      "1:1": 1,
      "4:3": 4 / 3,
      "3:4": 3 / 4
    };

    const aspectRatio = aspectMap[ratio];

    if (imgRef.current) {
      const { width, height } = imgRef.current;

      // 고정 너비 100px 설정
      const fixedWidth = 100;
      // 비율에 맞는 높이 계산
      const fixedHeight = fixedWidth / aspectRatio;

      // 픽셀값을 퍼센트로 변환
      const percentWidth = (fixedWidth / width) * 100;
      const percentHeight = (fixedHeight / height) * 100;

      // 왼쪽 위 모서리에 위치 (x=0, y=0)
      const percentCrop = {
        unit: '%',
        width: percentWidth,
        height: percentHeight,
        x: 0,
        y: 0,
        aspect: aspectRatio
      } as Crop;

      setCrop(percentCrop);
      setCompletedCrop(percentCrop);
    }
  };

  // 크롭 영역 초기화 버튼 클릭 시 실행되는 함수
  const handleResetCrop = useCallback((): void => {
    handleResetCropWithRatio(selectedRatio);
  }, [selectedRatio]);

  // 크롭 적용 버튼 클릭 시 실행되는 함수
  const handleApplyCrop = (): Promise<ImageCropResult> => {
    return new Promise((resolve, reject) => {
      // 중요 수정: completedCrop가 없거나 비어있으면 현재 crop 값 사용
      const cropToUse = completedCrop && completedCrop.width > 0 ? completedCrop : crop;

      if (!cropToUse || !imgRef.current || !image) {
        reject(new Error('크롭할 이미지가 없습니다.'));
        return;
      }

      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      // 크롭된 영역의 실제 픽셀 크기 계산
      const pixelWidth = cropToUse.width * scaleX;
      const pixelHeight = cropToUse.height * scaleY;

      // 원본 이미지 크기 대비 크롭 영역 비율 계산
      const originalArea = imgRef.current.width * imgRef.current.height;
      const cropArea = cropToUse.width * cropToUse.height;
      const cropRatio = (cropArea / originalArea) * 100;

      // 크롭 영역이 원본 이미지의 30% 미만인 경우 경고
      if (cropRatio < 30) {
        reject(new Error('IMAGE_TOO_SMALL'));
        return;
      }

      // 고화질 이미지를 위해 캔버스 사이즈 설정 (원본 해상도 유지)
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
        return;
      }

      ctx.drawImage(
        imgRef.current,
        cropToUse.x * scaleX,
        cropToUse.y * scaleY,
        pixelWidth,
        pixelHeight,
        0,
        0,
        pixelWidth,
        pixelHeight
      );

      // 크롭된 이미지를 Blob으로 변환 (고품질 설정)
      canvas.toBlob(blob => {
        if (blob) {
          // 크롭된 이미지를 원본 이미지 포맷으로 유지 
          const originalType = image.type || 'image/jpeg';

          // 크롭된 이미지 파일 생성 - 원본 타입 그대로 유지
          const croppedFile = new File([blob], image.name, {
            type: originalType,
            lastModified: Date.now()
          });

          // 크롭된 이미지 URL 생성
          const croppedUrl = URL.createObjectURL(blob);

          // 상태 업데이트
          setImage(croppedFile);
          setPreviewUrl(croppedUrl);
          setShowCropper(false);

          // 결과 반환
          resolve({
            file: croppedFile,
            previewUrl: croppedUrl
          });
        } else {
          reject(new Error('이미지 크롭 실패'));
        }
      }, image.type || 'image/jpeg', imageQuality); // 원본 이미지 형식과 품질 설정
    });
  };

  // 크롭 취소 버튼 클릭 시 실행되는 함수
  const handleCancelCrop = (): void => {
    setShowCropper(false);

    // 이미지가 원래 있었는지 없었는지에 따라 다르게 처리
    if (!initialImage || !initialPreviewUrl) {
      setImage(null);
      setPreviewUrl(null);
    } else {
      setImage(initialImage);
      setPreviewUrl(initialPreviewUrl);
    }
  };

  // 이미지를 WebP 형식으로 변환하는 함수
  const convertToWebP = (file: File, quality: number = imageQuality): Promise<Blob> => {
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

  return {
    // 상태
    image,
    previewUrl,
    showCropper,
    selectedRatio,
    crop,
    error,

    // 참조
    fileInputRef,
    imgRef,

    // 핸들러 및 유틸리티 함수
    handleImageChange,
    handleButtonClick,
    handleDragOver,
    handleDrop,
    handleCropComplete,
    handleRatioChange,
    handleApplyCrop,
    handleCancelCrop,
    handleResetCrop,
    setCrop,
    convertToWebP,
    setShowCropper,

    // 설정 값
    allowedAspectRatios,
    minSize,
    maxSize,
    imageQuality,
    maxAspectRatioDifference
  };
};

export default useImageCropper;