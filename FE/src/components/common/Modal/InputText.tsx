import React from 'react';

function InputText() {
  return (
    <div className="w-full my-3">
      <input 
        type="text" 
        placeholder="값을 입력해주세요" 
        className="w-full p-3 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  )
}

export default InputText