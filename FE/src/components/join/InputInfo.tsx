import { useState } from "react"
import { ChevronDown } from 'lucide-react';

function InputInfo() {
  const [gender, setGender] = useState<string>('')
  const [isDropDown, setIsDropDown] = useState<boolean>(false)

  const toggleDropDown = () => {
    setIsDropDown(prev => !prev)
  }

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender)
    setIsDropDown(false)
  }

  return (
    <div className='flex-row space-y-3'>
      <div>
        <label htmlFor="nameInput" className="font-p-500 text-subtitle-1-lg">이름(별명)</label>
        <input
          id="nameInput"
          type="text"
          placeholder='이름을 입력해 주세요'
          className="mt-2 w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="font-p-500 text-subtitle-1-lg">성별</label>
        <div className="relative">
          <button
            type="button"
            onClick={toggleDropDown}
            className="mt-2 w-full h-14 px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center text-gray-500">
            <span>{gender || '성별을 선택해 주세요'}</span>
            <ChevronDown size={20} />
          </button>

          {isDropDown && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-sm">
              <ul>
                <li
                  className="px-3 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectGender('여자')}
                >
                  여자
                </li>
                <li
                  className="px-3 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectGender('남자')}
                >
                  남자
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
      <div>
        <label htmlFor="phoneInput" className="font-p-500 text-subtitle-1-lg">전화번호</label>
        <input
          id="phoneInput"
          type="tel"
          placeholder='전화번호를 입력해 주세요'
          className="mt-2 w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default InputInfo