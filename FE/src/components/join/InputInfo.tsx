import React, { useState, useEffect } from "react";
import { ChevronDown } from 'lucide-react';

function InputInfo({
  onNameChange,
  onGenderChange,
  // onPhoneChange,
  onPhonePrefixChange,
  onPhoneMiddleChange,
  onPhoneSuffixChange,
  nameError,
  genderError,
  phoneError,
  initialName = "",
  initialGender = "",
  initialPhonePrefix = "010",
  initialPhoneMiddle = "",
  initialPhoneSuffix = "",
}) {
  const [name, setName] = useState(""); // 이름 상태
  const [gender, setGender] = useState(""); // 성별 상태
  // const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 상태
  const [phonePrefix, setPhonePrefix] = useState('010');
  const [phoneMiddle, setPhoneMiddle] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [isDropDown, setIsDropDown] = useState(false); // 드롭다운 상태
  const STYLES = {
    input:
      'px-2 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400',
    errorText: 'text-red-500 text-sm mt-1',
  };
  useEffect(() => {
    setName(initialName)
    setGender(initialGender)
    setPhonePrefix(initialPhonePrefix)
    setPhoneMiddle(initialPhoneMiddle)
    setPhoneSuffix(initialPhoneSuffix)
    //setPhoneNumber(initialPhone)
  }, [initialName, initialGender, initialPhonePrefix, initialPhoneMiddle, initialPhoneSuffix])

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
  /*const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value); // 전화번호 상태 변경
    onPhoneChange(value); // 부모 컴포넌트에 전화번호 변경 알리기
  };*/

  const handlePrefixChange = (e) => {
    const value = e.target.value;
    setPhonePrefix(value);
    onPhonePrefixChange(value);
  };

  const handleMiddleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneMiddle(value);
      onPhoneMiddleChange(value);
    }
  }
  const handleSuffixChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhoneSuffix(value);
      onPhoneSuffixChange(value);
    }
  }

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
      {/*<div>
        <label htmlFor="phoneInput" className="font-p-500 text-subtitle-1-lg">전화번호</label>
        <input
          id="phoneInput"
          type="tel"
          value={phoneNumber} // 전화번호 입력 값
          onChange={handlePhoneChange} // 전화번호 변경 처리
          placeholder='전화번호를 입력해 주세요'
          className="mt-2 w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
      </div> */}

      {/* 전화번호 입력 */}
      <div className="flex flex-col space-y-1">
        <label>전화번호</label>
        <div className="flex items-center space-x-2">
          <select
            name="phonePrefix"
            value={phonePrefix}
            onChange={handlePrefixChange}
            className={`${STYLES.input} w-1/3`}>
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
            <option value="019">019</option>
          </select>
          <span>-</span>
          <input
            type="text"
            name="phoneMiddle"
            value={phoneMiddle}
            onChange={handleMiddleChange}
            className={`${STYLES.input} w-1/3`}
            maxLength={4}
            placeholder="0000"
          />
          <span>-</span>
          <input
            type="text"
            name="phoneSuffix"
            value={phoneSuffix}
            onChange={handleSuffixChange}
            className={`${STYLES.input} w-1/3`}
            maxLength={4}
            placeholder="0000"
          />
        </div>
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>} {/* 전화번호 오류 메시지 */}
      </div>
    </div>
  );
}

export default InputInfo;
