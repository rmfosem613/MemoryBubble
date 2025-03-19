import useTextAreaRef from '@/hooks/useTextAreaRef';
import React from 'react';

interface FontEditorProps {
  text: string;
  fontSize: number;
  currentFontFamily: string;
  setCurrentFontFamily: (fontFamily: string) => void;
  onTextChange: (value: string) => void;
  onFontSizeChange: (size: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
  minFontSize?: number;
  maxFontSize?: number;
}

const FontEditor: React.FC<FontEditorProps> = ({
  text,
  fontSize,
  onTextChange,
  onFontSizeChange,
  currentFontFamily,
  // setCurrentFontFamily,
  placeholder = '여기에 텍스트를 입력하세요',
  autoFocus = false,
  minFontSize = 12,
  maxFontSize = 72,
}) => {
  const { textAreaRef } = useTextAreaRef(autoFocus);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFontSizeChange(Number(e.target.value));
  };

  return (
    <div>
      <div className="p-4 mb-4 min-h-64 flex flex-col">
        <textarea
          ref={textAreaRef}
          value={text}
          onChange={handleTextChange}
          spellCheck="false"
          className="flex-grow resize-none border-none outline-none w-full text-center"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: `${currentFontFamily}`,
            lineHeight: '1.3',
          }}
          placeholder={placeholder}
        />
      </div>

      <div className="container mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-subtitle-1-lg text-gray-600">크기</span>
          <span className="text-subtitle-1-lg text-gray-600">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={minFontSize}
          max={maxFontSize}
          value={fontSize}
          onChange={handleFontSizeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FontEditor;
