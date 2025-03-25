function InputGroupName({ onChangeGroupName, value }) {
  const handleInputChange = (e) => {
    onChangeGroupName(e.target.value);
  };

  return (
    <div>
      <p className="mb-[10px] font-p-500 text-subtitle-1-lg">그룹명</p>
      <input
        type="text"
        placeholder="그룹명을 설정해주세요"
        className="w-full h-14 p-3 border placeholder-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default InputGroupName;