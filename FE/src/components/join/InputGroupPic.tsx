import { useState, useRef, useEffect } from 'react'
import { Upload, Check, X, RefreshCcw } from 'lucide-react'
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

  // initialImage나 initialPreviewUrl이 변경되면 상태 업데이트
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage)
    }
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl)
    }
  }, [initialImage, initialPreviewUrl])

  // 이미지 선택 시 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)

      // 미리보기 생성
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const previewResult = event.target.result
        setPreviewUrl(previewResult)
        // 크롭 화면 보여주기
        setShowCropper(true)
      }
      fileReader.readAsDataURL(file)
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
      setImage(file)

      // 미리보기 url
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const previewResult = event.target.result
        setPreviewUrl(previewResult)
        // 크롭 화면 보여주기
        setShowCropper(true)
      }
      fileReader.readAsDataURL(file)
    }
  }

  // 이미지 크롭 완료 시 실행되는 함수
  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  // 크롭 적용 버튼 클릭 시 실행되는 함수
  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current) return

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext('2d')

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
    )

    // 크롭된 이미지를 Blob으로 변환
    canvas.toBlob(blob => {
      if (blob) {
        // 크롭된 이미지 파일 생성
        const croppedFile = new File([blob], image.name, {
          type: 'image/jpeg',
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
    }, 'image/jpeg')
  }

  // 크롭 취소 버튼 클릭 시 실행되는 함수
  const handleCancelCrop = () => {
    setShowCropper(false)
    setImage(null)
    setPreviewUrl(null)
  }

  // 크롭 영역 초기화 버튼 클릭 시 실행되는 함수
  const handleResetCrop = () => {
    // 이미지 전체에 대한 4:3 비율의 크롭 영역 계산
    if (imgRef.current) {
      const { width, height } = imgRef.current;

      let newWidth, newHeight, newX, newY;

      if (width / height > 4 / 3) {
        // 이미지가 더 넓은 경우
        newHeight = height;
        newWidth = height * (4 / 3);
        newX = (width - newWidth) / 2;
        newY = 0;
      } else {
        // 이미지가 더 좁거나 비율이 같은 경우
        newWidth = width;
        newHeight = width * (3 / 4);
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
        aspect: 4 / 3
      } as Crop;

      setCrop(percentCrop);
    } else {
      // imgRef.current가 없는 경우 기본값으로 설정
      setCrop({
        unit: '%',
        width: 100,
        height: 75,
        x: 0,
        y: 0,
        aspect: 4 / 3
      } as Crop);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 h-[300px]">
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
            <div className="relative w-[400px] h-[300px]">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="object-cover w-full h-full"
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
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] mt-[-60px] overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-center">이미지 크롭</h3>

            <div className="text-blue-500 font-semibold mb-2 text-center">4:3 비율로 이미지를 자르세요</div>
            <p className="text-gray-500 text-sm mb-4 text-center">영역을 드래그하여 조절할 수 있습니다</p>

            <div className="flex justify-center mb-6">
              <div className="max-w-full" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop as Crop)}
                  onComplete={handleCropComplete}
                  aspect={4 / 3}
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
  )
}

export default InputGroupPic