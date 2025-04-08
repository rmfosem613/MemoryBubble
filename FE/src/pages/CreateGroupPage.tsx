import { useState } from "react"
import { ChevronRight } from "lucide-react"
import Button from "@/components/common/Button/Button"

import InputGroupName from "@/components/join/InputGroupName"
import InputGroupPic from "@/components/join/InputGroupPic"

import { useNavigate } from 'react-router-dom'
import useUserStore from "@/stores/useUserStore"
import useUserApi from "@/apis/useUserApi"

import Title from "@/components/common/Title"

const CircleNumber = ({ number, isActive }) => {
  const bgColor = isActive ? "#7DABF8" : "#E1E1E8"
  const textColor = isActive ? "#FFFFFF" : "#4B4B51"

  return (
    <div
      className="relative flex items-center justify-center rounded-full mr-[6px] w-[21px] h-[21px]"
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-sm font-bold" style={{ color: textColor }}>{number}</span>
    </div>
  )
}

const CircleCheck = () => {
  return (
    <div className="relative flex items-center justify-center rounded-full mr-[6px] w-[22px] h-[22px] bg-[#1959B8]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
  )
}

function CreateGroupPage() {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const { createFamily, uploadImageWithPresignedUrl } = useUserApi()
  const [currentStep, setCurrentStep] = useState(1)
  const [groupName, setGroupName] = useState("")
  const [groupImage, setGroupImage] = useState(null)
  const [groupImagePreview, setGroupImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [nameError, setNameError] = useState("")
  const [imageError, setImageError] = useState("")
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!groupName) {
        setNameError("그룹명을 입력해주세요.")
        return
      }

      if (groupName.trim().length < 1) {
        setNameError("그룹명은 최소 1글자 이상이어야 합니다.")
        return
      }

      if (groupName.trim().length > 10) {
        setNameError("그룹명은 최대 10글자까지 가능합니다.")
        return
      }
      setGroupName(groupName.trim());
      setCurrentStep(currentStep + 1)
    } else {
      if (!groupImage) {
        setImageError("그룹 이미지를 등록해주세요.")
        return
      }

      // 이미지 크기 검증은 이미지 선택 시점에서 이미 완료됨

      // 완료 버튼을 눌렀을 때 가족 그룹 생성 API 호출
      try {
        setIsLoading(true)
        setError("")
        setImageError("")

        // API 호출로 가족 그룹 생성
        const response = await createFamily({
          familyName: groupName
        })

        const data = response.data
        setUser(data)

        // 이미지가 있는 경우 presignedUrl을 사용하여 S3에 이미지 업로드
        if (groupImage && data.presignedUrl) {
          try {
            // 이미지를 webp 형식으로 변환
            const webpBlob = await convertToWebp(groupImage)

            // presignedUrl을 사용하여 S3에 이미지 업로드
            await uploadImageWithPresignedUrl(
              data.presignedUrl,
              new File([webpBlob], data.fileName, { type: 'image/webp' })
            )
          } catch (uploadError) {
            console.error("이미지 업로드 실패:", uploadError)
            // 이미지 업로드 실패해도 그룹은 생성되었으므로 계속 진행
          }
        }

        // 성공 시 join 페이지로 이동 (아직 개인 정보 생성 전)
        navigate('/join')
      } catch (err) {
        console.error("가족 그룹 생성 실패:", err)
        setError("가족 그룹 생성에 실패했습니다. 다시 시도해주세요.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 현재 단계에 따른 텍스트 색상 반환
  const getTextColor = (step) => {
    if (step === currentStep) return "text-blue-500"
    if (step < currentStep) return "text-blue-600"
    return "text-gray-500"
  }

  const handleGroupNameChange = (name) => {
    setGroupName(name)
  }

  const handleImageChange = (file, previewUrl = null) => {
    if (file) {
      setGroupImage(file)

      // 미리보기 URL도 함께 저장 (전달 받았을 경우)
      if (previewUrl) {
        setGroupImagePreview(previewUrl)
      }

      setImageError("") // 이미지가 선택되면 에러 메시지 초기화
    }
  }

  // 이미지를 webp 형식으로 변환하는 함수
  const convertToWebp = async (file): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')

          // 원본 이미지 크기로 캔버스 설정 (고해상도 유지)
          canvas.width = img.width
          canvas.height = img.height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          // webp 형식으로 변환 (고품질 설정 - 0.95)
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert image to webp'))
            }
          }, 'image/webp', 0.95) // 고품질 webp 변환 (0.95)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = event.target.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  return (
    <>
      <div className="container">
        <Title text="그룹 생성하기" />
      </div>
      <div className="flex justify-center mt-[10px]">

        {/* 앞에 흰 div */}
        <div className="px-10 py-[40px] w-[440px] h-[550px] border border-gray-300 bg-white rounded-[8px] flex flex-col z-30">
          <div className="flex-grow">
            <div className="flex justify-center space-x-6">
              <div className="flex justify-center items-center">
                {currentStep > 1 ? (
                  <CircleCheck />
                ) : (
                  <CircleNumber number={1} isActive={currentStep >= 1} />
                )}
                <p className={`font-p-500 text-subtitle-1-lg ${getTextColor(1)}`}>그룹명 설정</p>
              </div>

              <ChevronRight color="#4B4B51" size={20} />

              <div className="flex justify-center items-center">
                {currentStep > 2 ? (
                  <CircleCheck />
                ) : (
                  <CircleNumber number={2} isActive={currentStep >= 2} />
                )}
                <p className={`font-p-500 text-subtitle-1-lg ${getTextColor(2)}`}>사진 등록</p>
              </div>
            </div>

            <hr className="my-8" />

            {/* 현재 단계에 따라 컨텐츠 표시 */}
            <div className="transition-opacity duration-300">
              {currentStep === 1 && (
                <InputGroupName
                  onChangeGroupName={handleGroupNameChange}
                  value={groupName}
                  error={nameError}
                  setError={setNameError} />
              )}
              {currentStep === 2 && (
                <>

                  <p className="text-xs text-gray-500 text-center">
                    이미지 크기는 100KB ~ 10MB 이내로 등록가능합니다.
                  </p>

                  <InputGroupPic
                    onImageChange={handleImageChange}
                    initialImage={groupImage}
                    initialPreviewUrl={groupImagePreview}
                  />


                </>
              )}
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {imageError && <p className="text-red-500 mt-2 text-center">{imageError}</p>}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end mt-auto">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button name="이전" color="white" onClick={handlePrev} />
              )}
              <Button
                name={currentStep === 2 ? "완료" : "다음"}
                color="blue"
                onClick={handleNext}
              />
            </div>
          </div>
        </div>

        {/* 세번째 파란색 div */}
        <div className="absolute mt-[20px] ml-[60px] px-8 py-[40px] w-[440px] h-[510px] bg-blue-500 rounded-[8px] flex flex-col z-10px" />

        {/* 두번째 하늘색 div */}
        <div className="absolute mt-[10px] ml-[30px] px-8 py-[40px] w-[440px] h-[530px] bg-blue-300 rounded-[8px] flex flex-col z-20px" />

      </div>
    </>
  )
}

export default CreateGroupPage