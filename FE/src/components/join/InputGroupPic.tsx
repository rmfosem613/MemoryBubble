import { useState, useRef, useEffect } from 'react'
import { Upload } from 'lucide-react'

function InputGroupPic({ onImageChange, initialImage = null, initialPreviewUrl = null }) {
  const [image, setImage] = useState(initialImage)
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl)
  const fileInputRef = useRef(null)

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
        // 부모 컴포넌트로 이미지 파일과 미리보기 URL 전달
        onImageChange(file, previewResult)
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
        // 부모 컴포넌트로 이미지 파일과 미리보기 URL 전달
        onImageChange(file, previewResult)
      } 
      fileReader.readAsDataURL(file)
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
      {previewUrl ? (
        <div className="relative w-[400px] h-[300px]">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="object-cover w-full h-full"
          />
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

      {/* 이미지 선택 안내 또는 재업로드 버튼 */}
      {previewUrl ? (
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          이미지 재업로드
        </button>
      ) : (
        <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-2">
          그룹을 대표할 사진을 선택해주세요
        </p>
      )}
    </div>
  ) 
}

export default InputGroupPic