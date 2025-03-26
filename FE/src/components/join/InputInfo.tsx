import { useState, useEffect } from "react";
import { ChevronDown } from 'lucide-react';

function InputInfo({ onNameChange, onGenderChange, onPhoneChange, nameError, genderError, phoneError }) {
  const [name, setName] = useState(""); // 이름 상태
  const [gender, setGender] = useState(""); // 성별 상태
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 상태
  const [isDropDown, setIsDropDown] = useState(false); // 드롭다운 상태

  // 드롭다운 토글 함수
  const toggleDropDown = () => {
    setIsDropDown(prev => !prev);
  };

  // 성별 선택 함수
  const selectGender = (selectedGender) => {
    setGender(selectedGender); // 성별 상태 변경
    setIsDropDown(false); // 드롭다운 닫기
    onGenderChange(selectedGender); // 부모 컴포넌트에 성별 변경 알리기
  };

  // 이름 변경 처리 함수
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value); // 이름 상태 변경
    onNameChange(value); // 부모 컴포넌트에 이름 변경 알리기
  };

  // 전화번호 변경 처리 함수
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value); // 전화번호 상태 변경
    onPhoneChange(value); // 부모 컴포넌트에 전화번호 변경 알리기
  };

  return (
    <div className='flex-row space-y-3'>
      {/* 이름 입력 필드 */}
      <div>
        <label htmlFor="nameInput" className="font-p-500 text-subtitle-1-lg">이름(별명)</label>
        <input
          id="nameInput"
          type="text"
          value={name} // 이름 입력 값
          onChange={handleNameChange} // 이름 변경 처리
          placeholder='이름을 입력해 주세요'
          className="mt-2 w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>} {/* 이름 오류 메시지 */}
      </div>

      {/* 성별 선택 */}
      <div>
        <label className="font-p-500 text-subtitle-1-lg">성별</label>
        <div className="relative">
          <button
            type="button"
            onClick={toggleDropDown} // 드롭다운 토글
            className="mt-2 w-full h-14 px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center text-gray-500">
            <span>{gender || '성별을 선택해 주세요'}</span> {/* 성별 선택 상태 */}
            <ChevronDown size={20} /> {/* 드롭다운 화살표 아이콘 */}
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropDown && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-sm">
              <ul>
                <li
                  className="px-3 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectGender('여자')} // 여자 선택
                >
                  여자
                </li>
                <li
                  className="px-3 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectGender('남자')} // 남자 선택
                >
                  남자
                </li>
              </ul>
            </div>
          )}
        </div>
        {genderError && <p className="text-red-500 text-sm mt-1">{genderError}</p>} {/* 성별 오류 메시지 */}
      </div>

      {/* 전화번호 입력 필드 */}
      <div>
        <label htmlFor="phoneInput" className="font-p-500 text-subtitle-1-lg">전화번호</label>
        <input
          id="phoneInput"
          type="tel"
          value={phoneNumber} // 전화번호 입력 값
          onChange={handlePhoneChange} // 전화번호 변경 처리
          placeholder='전화번호를 입력해 주세요'
          className="mt-2 w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>} {/* 전화번호 오류 메시지 */}
      </div>
    </div>
  );
}

export default InputInfo;
