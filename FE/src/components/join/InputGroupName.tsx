function InputGroupName({ onChangeGroupName, value, error, setError }) {
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if(newValue.length > 10) return;
    onChangeGroupName(newValue);
    
    // 입력값 유효성 검사
    if (newValue.length === 0) {
      setError("그룹명을 입력해주세요.");
    } else if (newValue.length < 1) {
      setError("그룹명은 최소 1글자 이상이어야 합니다.");
    } else if (newValue.length > 10) {
      setError("그룹명은 최대 10글자까지 가능합니다.");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="mb-[10px] font-p-500 text-subtitle-1-lg">
          그룹명
          <span className="text-gray-500 text-sm ml-[3px]">
            (최소 1자 ~ 최대 10자)
          </span>
        </p>
        <p className="text-gray-600 text-sm">{value.length || 0}/10</p>
      </div>

      <input
        type="text"
        placeholder="그룹명을 설정해주세요"
        className={`w-full h-14 p-3 border placeholder-gray-400 ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        value={value}
        onChange={handleInputChange}
        maxLength={10}
      />
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default InputGroupName;