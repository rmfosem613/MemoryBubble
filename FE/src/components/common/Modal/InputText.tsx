import React from 'react';

interface InputTextProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

function InputText({
  placeholder = '값을 입력해주세요',
  value,
  onChange,
  maxLength,
}: InputTextProps) {
  return (
    <div className="w-full my-3">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="w-full p-3 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      {maxLength && (
        <div
          className={`text-right text-sm mt-1 text-gray-500`}>
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default InputText;
