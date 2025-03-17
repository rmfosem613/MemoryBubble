import Button from "@/components/common/Button/Button";
import { useLetterInput } from '@/hooks/useLetterInput';

// dropdown menu
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import DatePicker from '@/components/common/DatePicker'

function LetterControls() {
  const { goToPreviousPage, goToNextPage } = useLetterInput();

  return (
    <div className="border-2 border-gray-300 rounded-[8px] h-full w-full mb-1">

      <div className="bg-gray-200 p-[10px] mb-[10px]">
        <p className="text-h5-lg font-subtitle-1">편지 상세 설정</p>
      </div>

      <div className="ml-[12px]">

        {/* 받는 사람 */}
        <p className="text-subtitle-1-lg font-subtitle-1 mb-[3px]">받는 사람</p>

        <Menu as="div" className="relative inline-block w-full pr-[12px] text-left mb-[15px]">
          <div>
            <MenuButton className="inline-flex w-full justify-between gap-x-1.5 rounded-[8px] bg-white px-3 py-2 text-p-sm font-pretendard text-gray-500 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
              멤버
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 w-[211px] origin-top-right divide-y divide-gray-100 mr-[13px] rounded-md bg-white ring-1 shadow-sm ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  울엄마
                </a>
              </MenuItem>
            </div>

            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  울아빠
                </a>
              </MenuItem>
            </div>

            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  사랑스런 큰딸
                </a>
              </MenuItem>
            </div>

            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  막내아들
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>

        {/* 느린 편지 보내기 */}
        <p className="text-subtitle-1-lg font-subtitle-1">느린 편지 보내기</p>
        <p className="text-sm-lg font-pretendard mb-[3px]">설정 시, 해당 날짜에 열람 가능합니다.</p>

        {/* DatePicker */}
        {/* <div className="border border-gray-300 h-[38px] rounded-[8px] mr-[12px] mb-[15px]">
        </div> */}
        <div className="mr-[12px] mb-[15px]">
          <DatePicker onChange={(date) => console.log('선택된 날짜:', date)} />
        </div>

        {/* 색상 */}
        <p className="text-subtitle-1-lg font-subtitle-1">색상</p>
        <div className="flex justify-between items-center border border-gray-300 h-[50px] rounded-[8px] mr-[12px] mb-[10px] pl-[18px] pr-[18px]">
          <div className="justify-center items-center w-[30px] h-[30px] bg-spring-200 rounded-full"></div>
          <div className="justify-center items-center w-[30px] h-[30px] bg-summer-200 rounded-full"></div>
          <div className="justify-center items-center w-[30px] h-[30px] bg-autumn-200 rounded-full"></div>
          <div className="justify-center items-center w-[30px] h-[30px] bg-winter-200 rounded-full"></div>
        </div>


      </div>

      {/* 텍스트 편지 페이지 네비게이션 */}
      <div className="flex space-x-12 pl-3 pr-3 justify-center">
        <div onClick={goToPreviousPage}>
          <Button icon="left" color="white" />
        </div>
        <div onClick={goToNextPage}>
          <Button icon="right" color="white" />
        </div>
      </div>

    </div>
  );
};

export default LetterControls;