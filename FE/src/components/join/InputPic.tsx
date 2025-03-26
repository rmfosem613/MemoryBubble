import { useState, useRef, useEffect } from 'react';
import { Upload, Check, X, RefreshCcw } from 'lucide-react';
import ReactCrop, { type Crop as LibCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// 확장된 Crop 인터페이스 정의
interface Crop extends LibCrop {
  aspect?: number;
}

function InputPic({ onImageChange, imageError, initialImage = null, initialPreviewUrl = null }) {
  const [image, setImage] = useState(initialImage); // 이미지 파일 상태
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl); // 이미지 미리보기 URL 상태
  const [showCropper, setShowCropper] = useState(false); // 크롭 모달 표시 상태
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 1 / 1 // 1:1 비율 설정
  } as Crop);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const fileInputRef = useRef(null); // 파일 입력 참조
  const imgRef = useRef(null); // 이미지 참조

  useEffect(() => {
    setImage(initialImage)
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl)
    } else if (initialImage && !previewUrl) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(initialImage)
    }
  }, [initialImage, initialPreviewUrl])

  // 이미지 파일이 변경되었을 때 처리하는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 첫 번째 파일 선택
    if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
      setImage(file); // 이미지 상태 설정

      // 이미지 미리보기 URL 생성
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setPreviewUrl(event.target.result); // 미리보기 URL 상태 설정
        // 크롭 화면 보여주기
        setShowCropper(true);
      };
      fileReader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
  };

  // 버튼 클릭 시 파일 입력 열기
  const handleButtonClick = () => {
    fileInputRef.current.click(); // 파일 입력 클릭
  };

  // 드래그 오버 시 기본 동작 방지
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 동작을 막아줌
  };

  // 드래그 앤 드롭 처리
  const handleDrop = (e) => {
    e.preventDefault(); // 기본 동작 방지
    const file = e.dataTransfer.files[0]; // 드래그한 파일
    if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
      setImage(file); // 이미지 상태 설정

      // 이미지 미리보기 URL 생성
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setPreviewUrl(event.target.result); // 미리보기 URL 상태 설정
        // 크롭 화면 보여주기
        setShowCropper(true);
      };
      fileReader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
  };

  // 이미지 크롭 완료 시 실행되는 함수
  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  // 크롭 적용 버튼 클릭 시 실행되는 함수
  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // 크롭된 이미지를 Blob으로 변환
    canvas.toBlob(blob => {
      if (blob) {
        // 크롭된 이미지 파일 생성
        const croppedFile = new File([blob], image.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        // 크롭된 이미지 URL 생성
        const croppedUrl = URL.createObjectURL(blob);
        
        // 상태 업데이트
        setImage(croppedFile);
        setPreviewUrl(croppedUrl);
        setShowCropper(false);
        
        // 부모 컴포넌트로 크롭된 이미지 전달
        onImageChange(croppedFile);
      }
    }, 'image/jpeg');
  };

  // 크롭 취소 버튼 클릭 시 실행되는 함수
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImage(null);
    setPreviewUrl(null);
  };
  
  // 크롭 영역 초기화 버튼 클릭 시 실행되는 함수
  const handleResetCrop = () => {
    // 이미지 전체에 대한 1:1 비율의 크롭 영역 계산
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      
      let newWidth, newHeight, newX, newY;
      
      if (width > height) {
        // 이미지가 가로로 긴 경우
        newHeight = height;
        newWidth = height;
        newX = (width - newWidth) / 2;
        newY = 0;
      } else {
        // 이미지가 세로로 길거나 정사각형인 경우
        newWidth = width;
        newHeight = width;
        newX = 0;
        newY = (height - newHeight) / 2;
      }
      
      // 퍼센트로 변환
      const percentCrop = {
        unit: '%',
        width: (newWidth / width) * 100,
        height: (newHeight / height) * 100,
        x: (newX / width) * 100,
        y: (newY / height) * 100,
        aspect: 1 / 1
      } as Crop;
      
      setCrop(percentCrop);
    } else {
      // imgRef.current가 없는 경우 기본값으로 설정
      setCrop({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        aspect: 1 / 1
      } as Crop);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 h-[300px]">

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*" // 이미지 파일만 선택 가능
        onChange={handleImageChange} // 이미지 변경 시 처리 함수
      />

      {/* 이미지 미리보기 또는 업로드 박스 */}
      {!showCropper && (
        <>
          {previewUrl ? (
            <div className="relative w-40 h-40">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-40 h-40 rounded-full object-cover border-4"
              />
              {/* 업로드 버튼 */}
              <div
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={handleButtonClick} // 업로드 버튼 클릭 시 파일 선택
              >
                <Upload size={16} className="text-white" />
              </div>
            </div>
          ) : (
            <div
              className="w-40 h-40 rounded-full border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
              onClick={handleButtonClick} // 업로드 박스 클릭 시 파일 선택
              onDragOver={handleDragOver} // 드래그 오버 시 처리
              onDrop={handleDrop} // 드래그 앤 드롭 시 처리
            >
              <Upload size={32} className="text-gray-600 mb-2" />
              <p className="text-sm text-gray-600">클릭하거나 드래그</p>
            </div>
          )}

          {/* 프로필 사진 설명 */}
          <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-2">프로필 사진을 통해 본인을 표현해 주세요</p>

          {/* 이미지 오류 메시지 */}
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
        </>
      )}

      {/* 이미지 크롭 모달 */}
      {showCropper && (
        <div className="fixed bg-black bg-opacity-50 z-50 flex items-center justify-center w-full h-full top-[37px]">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] mt-[-60px] overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-center">이미지 크롭</h3>
            
            <div className="text-blue-500 font-semibold mb-2 text-center">1:1 비율로 이미지를 자르세요</div>
            <p className="text-gray-500 text-sm mb-4 text-center">영역을 드래그하여 조절할 수 있습니다</p>
            
            <div className="flex justify-center mb-6">
              <div className="max-w-full" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop as Crop)}
                  onComplete={handleCropComplete}
                  aspect={1/1}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    alt="Crop Preview"
                    className="max-w-full max-h-full"
                    style={{ maxHeight: 'calc(90vh - 250px)' }}
                  />
                </ReactCrop>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleApplyCrop}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
              >
                <Check size={16} className="mr-1" /> 적용
              </button>
              <button
                onClick={handleResetCrop}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
              >
                <RefreshCcw size={16} className="mr-1" /> 초기화
              </button>
              <button
                onClick={handleCancelCrop}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
              >
                <X size={16} className="mr-1" /> 취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputPic;