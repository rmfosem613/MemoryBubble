function InputInfo() {
  return (
    <div className='flex-row space-y-3'>
      <div>
        <p className="mb-[10px] font-p-500 text-subtitle-1-lg">이름(별명)</p>
        <input
          type="text"
          placeholder='이름을 입력해 주세요'
          className="w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <p className="mb-[10px] font-p-500 text-subtitle-1-lg">성별</p>
        <input
          type="text"
          placeholder='성별을 입력해 주세요'
          className="w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div> <div>
        <p className="mb-[10px] font-p-500 text-subtitle-1-lg">전화번호</p>
        <input
          type="tel"
          placeholder='전화번호를 입력해 주세요'
          className="w-full h-14 p-3 border placeholder-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default InputInfo