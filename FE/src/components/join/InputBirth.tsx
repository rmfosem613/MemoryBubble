import { useEffect, useState } from "react";

function InputBirth({ onBirthChange, birthError, initialBirth = "" }) {
  const [birthDate, setBirthDate] = useState(""); // 생일 상태
  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 YYYY-MM-DD 형식으로 변환

  useEffect(() => {
    setBirthDate(initialBirth)
  }, [initialBirth])

  // 생일 날짜 변경 처리 함수
  const handleDateChange = (e) => {
    const value = e.target.value;
    setBirthDate(value); // 생일 상태 변경
    onBirthChange(value); // 부모 컴포넌트에 생일 값 전달
  };

  return (
    <div>
      <p className="mb-[10px] font-p-500 text-subtitle-1-lg">
        생일{' '}
        <span className="text-gray-500 text-subtitle-2-lg pl-1">
          (1999-01-01~{today})
        </span>
      </p>
      {/* 생일 입력 필드 */}
      <input
        type="date"
        value={birthDate} // 생일 입력 값
        onChange={handleDateChange} // 생일 변경 처리
        min="1900-01-01"
        max={today} // 오늘 날짜를 최대값으로 설정하여 미래 날짜 선택 방지
        className="w-full h-14 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {/* 생일 입력 오류 메시지 */}
      {birthError && <p className="text-red-500 text-sm mt-1">{birthError}</p>}

    </div>
  );
}

export default InputBirth;