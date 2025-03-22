import React from 'react';
import Title from '../common/Title';
import FontEditor from './fontComponent/FontEditor';
import FontActions from './fontComponent/FontActions';
import useFontDownload from '@/hooks/useFontDownload';
import useFont from '@/hooks/useFont';
import useTextAreaRef from '@/hooks/useTextAreaRef';

function FontDownload() {
  const { font, text, fontSize, setText, setFontSize, resetText } = useFont();

  const { downloadFont, resetFont } = useFontDownload({
    fontName: font,
    text,
  });

  const { currentFontFamily, setCurrentFontFamily } = useTextAreaRef();

  const handleReset = () => {
    resetText();
    resetFont();
  };

  return (
    <div className="container">
      <div className="flex items-baseline mb-3">
        <Title text="나의 폰트" />
        <p className="pt-1 pl-2 text-gray-600 text-subtitle-1-lg font-p-500">
          나만의 폰트를 확인해보고 다운로드 해보세요
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="text-h3-lg font-p-700 mb-2">{font}</div>

        <FontEditor
          text={text}
          fontSize={fontSize}
          onTextChange={setText}
          onFontSizeChange={setFontSize}
          autoFocus={true}
          currentFontFamily={currentFontFamily}
          setCurrentFontFamily={setCurrentFontFamily}
        />

        <FontActions onDownload={downloadFont} onReset={handleReset} />
      </div>
    </div>
  );
}

export default FontDownload;
