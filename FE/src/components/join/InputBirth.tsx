function InputBirth() {
  return (
    <div>
      <p className="mb-[10px] font-p-500 text-subtitle-1-lg">생일</p>
      <input
        type="date"
        className="w-full h-14 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex items-center space-x-2 mt-[10px]">
        <p className="text-p-md font-p-800 text-blue-500">양력</p>
        <div className="text-p-md text-gray-600">|</div>
        <p className="text-p-md font-p-500 text-gray-600">음력</p>
      </div>
    </div>
  )
}

export default InputBirth