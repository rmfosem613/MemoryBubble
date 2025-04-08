import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Button from "@/components/common/Button/Button";

import InputInfo from "@/components/join/InputInfo";
import InputBirth from "@/components/join/InputBirth";
import InputPic from "@/components/join/InputPic";

import { useNavigate } from 'react-router-dom';
import useUserApi from "@/apis/useUserApi";

import Title from "@/components/common/Title";
import Alert from "@/components/common/Alert";
import useUserStore from "@/stores/useUserStore";
import useUser from "@/hooks/useUser";

// react-icons를 대신할 커스텀 컴포넌트
const CircleNumber = ({ number, isActive }) => {
  const bgColor = isActive ? "#7DABF8" : "#E1E1E8";
  const textColor = isActive ? "#FFFFFF" : "#4B4B51";

  return (
    <div
      className="relative flex items-center justify-center rounded-full mr-[6px] w-[21px] h-[21px]"
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-sm font-bold" style={{ color: textColor }}>{number}</span>
    </div>
  );
};

const CircleCheck = () => {
  return (
    <div className="relative flex items-center justify-center rounded-full mr-[6px] w-[22px] h-[22px] bg-[#1959B8]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
  );
};

function JoinPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { joinFamily, uploadImageWithPresignedUrl } = useUserApi();
  const { fetchProfileAndFamilyInfo } = useUser();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [phonePrefix, setPhonePrefix] = useState('010');
  const [phoneMiddle, setPhoneMiddle] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [birth, setBirth] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // 폼 유효성 검사 상태
  const [nameError, setNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [birthError, setBirthError] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    const shouldShowAlert = sessionStorage.getItem('showJoinAlert');
    if (shouldShowAlert === 'true') {
      setShowAlert(true);
      // 한 번 표시한 후에는 알림 표시 제거
      sessionStorage.removeItem('showJoinAlert');
    }
  }, []);

  // 다음 버튼 클릭 시 실행되는 함수
  const handleNext = async () => {
    if (currentStep === 1) {
      // 개인정보 유효성 검사
      let hasError = false;

      if (!name) {
        setNameError("이름을 입력해주세요.");
        hasError = true;
      }

      if (!gender) {
        setGenderError("성별을 선택해주세요.");
        hasError = true;
      }

      /*if (!phoneNumber) {
        setPhoneError("전화번호를 입력해주세요.");
        hasError = true;
      }*/

      if(!phonePrefix || !phoneMiddle || !phoneSuffix) {
        setPhoneError("전화번호를 입력해주세요.");
        hasError = true;
      } else if (phoneMiddle.length !== 4 || phoneSuffix.length !== 4) {
        setPhoneError("전화번호 형식이 올바르지 않습니다.");
        hasError = true;
      }

      if (hasError) return;

      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      // 생일 입력 유효성 검사
      if (!birth) {
        setBirthError("생일을 입력해주세요.");
        return;
      }
      else if(birth < "1900-01-01" || birth > new Date().toISOString().split('T')[0]) {
        setBirthError("생일이 올바르지 않습니다.");
        return;
      }

      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계: 이미지 등록 및 제출
      if (!profileImage) {
        setImageError("프로필 사진을 등록해주세요.");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        // 성별을 API 포맷에 맞게 변환
        const genderCode = gender === "여자" ? "F" : "M";
        // 휴대폰번호 변환
        const phoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneSuffix}`;

        // 가족 가입 API 호출 (useUserApi 사용)
        const response = await joinFamily({
          familyId: user?.familyId,
          birth: birth,
          name: name,
          phoneNumber: phoneNumber,
          gender: genderCode
        });

        const data = response.data;

        // S3에 이미지를 업로드하기 위한 presigned URL 사용
        if (profileImage && data.presignedUrl) {
          try {
            // 이미지를 webp 형식으로 변환
            const imageBlob = await convertToWebP(profileImage);

            // presigned URL을 통해 이미지 업로드 (useUserApi 사용)
            await uploadImageWithPresignedUrl(
              data.presignedUrl,
              new File([imageBlob], data.fileName, { type: 'image/webp' })
            );
          } catch (uploadError) {
            console.error("이미지 업로드 실패:", uploadError);
            // 이미지 업로드 실패해도 계속 진행
          }
        }

         // 사용자 정보 조회 및 상태 업데이트
        await fetchProfileAndFamilyInfo(user.userId, user.familyId);

        // 가입 성공 후 메인 페이지로 이동
        navigate('/main');
      } catch (err) {
        console.error("가입 실패:", err);
        setError("가입에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 이미지를 webp 형식으로 변환하는 함수
  const convertToWebP = async (file): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // webp 형식으로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('이미지 webp 형식으로 변환 실패'));
            }
          }, 'image/webp');
        };
        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = event.target.result as string;
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(file);
    });
  };

  // 이전 단계로 돌아가기
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 단계에 따라 텍스트 색상을 변경하는 함수
  const getTextColor = (step) => {
    if (step === currentStep) return "text-blue-500";
    if (step < currentStep) return "text-blue-600";
    return "text-gray-500";
  };

  // 자식 컴포넌트에서 받은 폼 데이터 처리 함수
  const handleNameChange = (value) => {
    setName(value);
    setNameError("");
  };

  const handleGenderChange = (value) => {
    setGender(value);
    setGenderError("");
  };

  /*const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    setPhoneError("");
  };*/

  const handlePhonePrefix = (value) => {
    setPhonePrefix(value);
    setPhoneError("");
  }
  const handlePhoneMiddle = (value) => {
    setPhoneMiddle(value);
    setPhoneError("");
  }
  const handlePhoneSuffix = (value) => {
    setPhoneSuffix(value);
    setPhoneError("");
  }

  const handleBirthChange = (value) => {
    setBirth(value);
    setBirthError("");
  };

  const handleImageChange = (file) => {
    setProfileImage(file);

    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setProfileImagePreview(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }

    setImageError("");
  };

  return (
    <>
      {showAlert && (
        <Alert message="그룹 생성을 완료해주세요." color="red" />
      )}

      <div className="container">
        <Title text="그룹 가입하기" />
      </div>

      <div className="flex mt-[10px] items-center justify-center">

        {/* 앞에 흰색 배경의 div */}
        <div className="px-10 py-[40px] w-[440px] h-[550px] border border-gray-300 bg-white rounded-[8px] flex flex-col z-30">
          <div className="flex-grow">
            <div className="flex justify-between">
              <div className="flex justify-center items-center">
                {currentStep > 1 ? (
                  <CircleCheck />
                ) : (
                  <CircleNumber number={1} isActive={currentStep >= 1} />
                )}
                <p className={`font-p-500 text-subtitle-1-lg ${getTextColor(1)}`}>개인정보</p>
              </div>

              <ChevronRight color="#4B4B51" size={20} />

              <div className="flex justify-center items-center">
                {currentStep > 2 ? (
                  <CircleCheck />
                ) : (
                  <CircleNumber number={2} isActive={currentStep >= 2} />
                )}
                <p className={`font-p-500 text-subtitle-1-lg ${getTextColor(2)}`}>생일입력</p>
              </div>

              <ChevronRight color="#4B4B51" size={20} />

              <div className="flex justify-center items-center">
                <CircleNumber number={3} isActive={currentStep >= 3} />
                <p className={`font-p-500 text-subtitle-1-lg ${getTextColor(3)}`}>사진등록</p>
              </div>
            </div>

            <hr className="my-8" />

            {/* 현재 단계에 맞는 콘텐츠 표시 */}
            <div className="transition-opacity duration-300">
              {currentStep === 1 && (
                <InputInfo
                  onNameChange={handleNameChange}
                  onGenderChange={handleGenderChange}
                  onPhonePrefixChange={handlePhonePrefix}
                  onPhoneMiddleChange={handlePhoneMiddle}
                  onPhoneSuffixChange={handlePhoneSuffix}
                  nameError={nameError}
                  genderError={genderError}
                  phoneError={phoneError}
                  initialName={name}
                  initialGender={gender}
                  initialPhonePrefix={phonePrefix}
                  initialPhoneMiddle={phoneMiddle}
                  initialPhoneSuffix={phoneSuffix}
                />
              )}
              {currentStep === 2 && (
                <InputBirth
                  onBirthChange={handleBirthChange}
                  birthError={birthError}
                  initialBirth={birth}
                />
              )}
              {currentStep === 3 && (
                <InputPic
                  onImageChange={handleImageChange}
                  imageError={imageError}
                  initialImage={profileImage}
                  initialPreviewUrl={profileImagePreview}
                />
              )}
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </div>

          {/* 하단에 고정된 버튼들 */}
          <div className="flex justify-end mt-auto">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button name="이전" color="white" onClick={handlePrev} />
              )}
              <Button
                name={currentStep === 3 ? (isLoading ? "처리 중..." : "완료") : "다음"}
                color="blue"
                onClick={handleNext}
              />
            </div>
          </div>
        </div>

        {/* 세 번째 파란색 배경의 div */}
        <div className="absolute ml-[60px] px-8 py-[40px] w-[440px] h-[510px] bg-blue-500 rounded-[8px] flex flex-col z-10px" />


        {/* 두 번째 하늘색 배경의 div */}
        <div className="absolute ml-[30px] px-8 py-[40px] w-[440px] h-[530px] bg-blue-300 rounded-[8px] flex flex-col z-20px" />


      </div>
    </>
  );
}

export default JoinPage;
