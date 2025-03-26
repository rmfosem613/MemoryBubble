import { useState } from "react";

function InputBirth({ onBirthChange, birthError }) {
  const [birthDate, setBirthDate] = useState(""); // 생일 상태
  // const [calendarType, setCalendarType] = useState("solar"); // 양력 또는 음력 구분 (기본값은 양력)

  // 생일 날짜 변경 처리 함수
  const handleDateChange = (e) => {
    const value = e.target.value;
    setBirthDate(value); // 생일 상태 변경
    onBirthChange(value); // 부모 컴포넌트에 생일 값 전달
  };

  // 양력/음력 선택 처리 함수
  // const handleCalendarTypeChange = (type) => {
    // setCalendarType(type); // 양력/음력 상태 변경
    // 실제 구현에서는 양력과 음력 간 변환을 처리할 수 있습니다.
    // 현재는 캘린더 유형만 업데이트합니다.
  // };

  return (
    <div>
      <p className="mb-[10px] font-p-500 text-subtitle-1-lg">생일</p>
      {/* 생일 입력 필드 */}
      <input
        type="date"
        value={birthDate} // 생일 입력 값
        onChange={handleDateChange} // 생일 변경 처리
        className="w-full h-14 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {/* 생일 입력 오류 메시지 */}
      {birthError && <p className="text-red-500 text-sm mt-1">{birthError}</p>}
      
      {/* 양력/음력 선택 버튼 */}
      {/* <div className="flex items-center space-x-2 mt-[10px]">
        <p 
          className={`text-p-md font-p-800 cursor-pointer ${calendarType === "solar" ? "text-blue-500" : "text-gray-600"}`}
          onClick={() => handleCalendarTypeChange("solar")} // 양력 선택
        >양력</p>
        <div className="text-p-md text-gray-600">|</div>
        <p 
          className={`text-p-md font-p-500 cursor-pointer ${calendarType === "lunar" ? "text-blue-500" : "text-gray-600"}`}
          onClick={() => handleCalendarTypeChange("lunar")} // 음력 선택
        >음력</p>
      </div> */}
    </div>
  );
}

export default InputBirth;
