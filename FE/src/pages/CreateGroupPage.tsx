import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Button from "@/components/common/Button/Button";

import InputGroupName from "@/components/join/InputGroupName";
import InputGroupPic from "@/components/join/InputGroupPic";

import { useNavigate } from 'react-router-dom'

import Title from "@/components/common/Title";

// Custom components to replace missing react-icons
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

function CreateGroupPage() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // 완료 버튼을 눌렀을 때 메인 페이지로 이동
      navigate('/join');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get text color based on step status
  const getTextColor = (step) => {
    if (step === currentStep) return "text-blue-500";
    if (step < currentStep) return "text-blue-600";
    return "text-gray-500";
  };

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

              {/* <ChevronRight color="#4B4B51" size={20} />

            <div className="flex justify-center items-center">
              <CircleNumber number={3} isActive={currentStep >= 3} />
              <p className={`font-p-500 text-subtitle-1-lg ${getTextColor(3)}`}>사진등록</p>
            </div> */}
            </div>

            <hr className="my-8" />

            {/* Content based on current step */}
            <div className="transition-opacity duration-300">
              {currentStep === 1 && <InputGroupName />}
              {currentStep === 2 && <InputGroupPic />}
            </div>
          </div>

          {/* Buttons fixed to bottom */}
          <div className="flex justify-end mt-auto">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button name="이전" color="white" onClick={handlePrev} />
              )}
              <Button name={currentStep === 2 ? "완료" : "다음"} color="blue" onClick={handleNext} />
            </div>
          </div>
        </div>

        {/* 세번째 파란색 div */}
        <div className="absolute ml-[60px] px-8 py-[40px] w-[440px] h-[510px] bg-blue-500 rounded-[8px] flex flex-col z-10px" />


        {/* 두번째 하늘색 div */}
        <div className="absolute ml-[30px] px-8 py-[40px] w-[440px] h-[530px] bg-blue-300 rounded-[8px] flex flex-col z-20px" />


      </div>
    </>
  );
}

export default CreateGroupPage;