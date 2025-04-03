import { useState, useRef, useEffect } from 'react'
import { Upload, Check, X, RefreshCcw, Crop } from 'lucide-react'
import ReactCrop, { type Crop as LibCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// 확장된 Crop 인터페이스 정의
interface Crop extends LibCrop {
  aspect?: number;
}

function InputGroupPic({ onImageChange, initialImage = null, initialPreviewUrl = null }) {
  const [image, setImage] = useState(initialImage)
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedRatio, setSelectedRatio] = useState("4:3") // 기본 비율
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 75,
    x: 0,
    y: 0,
    aspect: 4 / 3
  } as Crop)
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const fileInputRef = useRef(null)
  const imgRef = useRef(null)
  const imageLoaded = useRef(false)

  // initialImage나 initialPreviewUrl이 변경되면 상태 업데이트
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage)
    }
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl)
    }
  }, [initialImage, initialPreviewUrl])

  // 비율이 변경되면 crop 상태 업데이트
  useEffect(() => {
    const aspectRatio = selectedRatio === "4:3" ? 4 / 3 : 3 / 4

    setCrop(prev => ({
      ...prev,
      aspect: aspectRatio
    }) as Crop)

    // 이미지가 로드된 상태라면 crop 영역 재설정
    if (imgRef.current) {
      handleResetCrop()
    }
  }, [selectedRatio])

  // 모달이 열릴 때 실행되는 초기화 함수
  useEffect(() => {
    if (showCropper && imgRef.current && previewUrl) {
      // 이미지가 로드될 때까지 기다리기 위한 이미지 로드 이벤트 리스너
      const img = imgRef.current
      const onImageLoad = () => {
        imageLoaded.current = true
        // 이미지 로드 후 crop 영역 초기화
        handleResetCrop()


        // 초기 completedCrop 값 설정
        // setCompletedCrop(crop)

        setTimeout(() => {
          setCompletedCrop({ ...crop })
        }, 100)
      }

      if (img.complete) {
        // 이미지가 이미 캐시되어 있는 경우
        onImageLoad()
      } else {
        // 이미지가 아직 로드 중인 경우
        img.addEventListener('load', onImageLoad)
        return () => {
          img.removeEventListener('load', onImageLoad)
        }
      }
    }
  }, [showCropper, previewUrl])

  // 이미지 크기 유효성 검사 함수
  const validateImageSize = (file) => {
    const minSize = 100 * 1024; // 100KB
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (file.size < minSize) {
      alert('이미지 크기가 너무 작습니다. 최소 100KB 이상이어야 합니다.');
      return false;
    }

    if (file.size > maxSize) {
      alert('이미지 크기가 너무 큽니다. 최대 3MB 이하여야 합니다.');
      return false;
    }

    return true;
  }

  // 이미지 선택 시 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      // 이미지 크기 검증
      if (!validateImageSize(file)) {
        return;
      }

      // 미리보기 생성
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const previewResult = event.target.result
        setPreviewUrl(previewResult)
        // 기본값으로 4:3 비율 설정
        setSelectedRatio("4:3")
        // 이미지 로드 상태 초기화
        imageLoaded.current = false
        // 크롭 화면 보여주기
        setShowCropper(true)
      }
      fileReader.readAsDataURL(file)

      // 이미지 파일 저장
      setImage(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  // 드래그 허용
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // 파일 드롭
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      // 이미지 크기 검증
      if (!validateImageSize(file)) {
        return;
      }

      // 미리보기 url
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const previewResult = event.target.result
        setPreviewUrl(previewResult)
        // 기본값으로 4:3 비율 설정
        setSelectedRatio("4:3")
        // 이미지 로드 상태 초기화
        imageLoaded.current = false
        // 크롭 화면 보여주기
        setShowCropper(true)
      }
      fileReader.readAsDataURL(file)

      // 이미지 파일 저장
      setImage(file)
    }
  }

  // 이미지 크롭 완료 시 실행되는 함수
  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  // 비율 변경 핸들러
  const handleRatioChange = (ratio) => {
    setSelectedRatio(ratio)
  }

  // 크롭 적용 버튼 클릭 시 실행되는 함수
  const handleApplyCrop = () => {
    // completedCrop이 없으면 현재 crop 값 사용
    const cropToUse = crop

    if (!cropToUse || !imgRef.current) return

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    // 크롭된 영역의 실제 픽셀 크기 계산
    const pixelWidth = cropToUse.width * scaleX
    const pixelHeight = cropToUse.height * scaleY

    // 고화질 이미지를 위해 캔버스 사이즈 설정 (원본 해상도 유지)
    canvas.width = pixelWidth
    canvas.height = pixelHeight

    const ctx = canvas.getContext('2d')

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
    )

    // 크롭된 이미지를 Blob으로 변환 (고품질 설정)
    canvas.toBlob(blob => {
      if (blob) {
        // 크롭된 이미지를 원본 이미지 포맷으로 유지 
        const originalType = image.type || 'image/jpeg'

        // 크롭된 이미지 파일 생성 - 원본 타입 그대로 유지
        const croppedFile = new File([blob], image.name, {
          type: originalType,
          lastModified: Date.now()
        })

        // 크롭된 이미지 URL 생성
        const croppedUrl = URL.createObjectURL(blob)

        // 상태 업데이트
        setImage(croppedFile)
        setPreviewUrl(croppedUrl)
        setShowCropper(false)

        // 부모 컴포넌트로 크롭된 이미지 전달
        onImageChange(croppedFile, croppedUrl)
      }
    }, image.type || 'image/jpeg', 1.0) // 원본 이미지 형식과 최대 품질(1.0)로 설정
  }

  // 크롭 취소 버튼 클릭 시 실행되는 함수
  const handleCancelCrop = () => {
    setShowCropper(false)
    setImage(null)
    setPreviewUrl(null)
  }

  // 크롭 영역 초기화 버튼 클릭 시 실행되는 함수
  const handleResetCrop = () => {
    // 현재 선택된 비율 가져오기
    const aspectRatio = selectedRatio === "4:3" ? 4 / 3 : 3 / 4

    // 이미지 전체에 대한 선택된 비율의 크롭 영역 계산
    if (imgRef.current) {
      const { width, height } = imgRef.current;

      let newWidth, newHeight, newX, newY;

      if (width / height > aspectRatio) {
        // 이미지가 더 넓은 경우
        newHeight = height;
        newWidth = height * aspectRatio;
        newX = (width - newWidth) / 2;
        newY = 0;
      } else {
        // 이미지가 더 좁거나 비율이 같은 경우
        newWidth = width;
        newHeight = width / aspectRatio;
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
        aspect: aspectRatio
      } as Crop;

      setCrop(percentCrop);
      // 초기 영역도 completedCrop으로 설정하여 적용 버튼 클릭 시 사용될 수 있도록 함
      setCompletedCrop(percentCrop);
    } else {
      // imgRef.current가 없는 경우 기본값으로 설정
      const defaultCrop = {
        unit: '%',
        width: 100,
        height: aspectRatio === 4 / 3 ? 75 : 133.33,
        x: 0,
        y: 0,
        aspect: aspectRatio
      } as Crop;

      setCrop(defaultCrop);
      setCompletedCrop(defaultCrop);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center h-[300px]">
      {/* 숨겨진 파일 입력 필드 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* 이미지 미리보기 또는 업로드 */}
      {!showCropper && (
        <>
          {previewUrl ? (
            <div className="relative w-[400px] h-[300px] flex items-center justify-center bg-gray-100">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '300px' }}
              />

              <button
                onClick={handleButtonClick}
                className="absolute z-50 bg-white text-blue-500 border border-blue-500 font-p-500 py-2 px-4 rounded-[8px] bottom-[10px] right-[10px]"
              >
                이미지 재업로드
              </button>
            </div>
          ) : (
            <div
              className="w-[400px] h-[300px] border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
              onClick={handleButtonClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload size={32} className="text-gray-600 mb-2" />
              <p className="text-sm text-gray-600">클릭하거나 드래그</p>
            </div>
          )}

          {!previewUrl && (
            <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-2">
              그룹을 대표할 사진을 선택해주세요
            </p>
          )}
        </>
      )}

      {/* 이미지 크롭 모달 */}
      {showCropper && (
        <div className="fixed bg-black bg-opacity-50 z-50 flex items-center justify-center w-full h-full top-[37px]">
          <div className="flex justify-center space-x-6 bg-white rounded-lg p-6 max-w-[90vh] max-h-[90vh] mt-[-60px] overflow-auto">


            {/* 영역1 */}
            <div className='flex-col'>

              <div className='flex space-x-2'>
                <Crop />
                <h3 className="text-xl font-bold mb-4 text-start w-[110px]">이미지 자르기</h3>
              </div>
              {/* 비율 선택 버튼 (모달 내부에 위치) */}
              <div className="mb-4">
                <div className="flex flex-col space-y-4 mb-4">
                  <button
                    className={`px-5 py-2 rounded-md ${selectedRatio === "4:3"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"}`}
                    onClick={() => handleRatioChange("4:3")}
                  >
                    가로 (4:3)
                  </button>
                  <button
                    className={`px-5 py-2 rounded-md ${selectedRatio === "3:4"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"}`}
                    onClick={() => handleRatioChange("3:4")}
                  >
                    세로 (3:4)
                  </button>
                </div>
              </div>
            </div>

            {/* 영역2 */}

            <div className='flex-col'>
              {/* <div className="text-blue-500 font-semibold mb-2 text-center">{selectedRatio} 비율로 이미지를 자르세요</div> */}
              {/* <p className="text-gray-500 text-sm mb-4 text-center">영역을 드래그하여 조절할 수 있습니다</p> */}

              <div className="flex justify-center mb-6">
                <div className="max-w-full" style={{ maxHeight: 'calc(90vh - 350px)' }}>
                  <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop as Crop)}
                    onComplete={handleCropComplete}
                    aspect={selectedRatio === "4:3" ? 4 / 3 : 3 / 4}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      src={previewUrl}
                      alt="Crop Preview"
                      className="max-w-full max-h-full"
                      style={{ maxHeight: 'calc(90vh - 350px)' }}
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleApplyCrop}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-p-500 py-2 px-4 rounded transition-colors flex items-center"
                >
                  <Check size={16} className="mr-1" /> 적용
                </button>
                <button
                  onClick={handleResetCrop}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-p-500 py-2 px-4 rounded transition-colors flex items-center"
                >
                  <RefreshCcw size={16} className="mr-1" /> 초기화
                </button>
                <button
                  onClick={handleCancelCrop}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-p-500 py-2 px-4 rounded transition-colors flex items-center"
                >
                  <X size={16} className="mr-1" /> 취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InputGroupPic