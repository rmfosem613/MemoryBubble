import Title from '../common/Title';
import FontEditor from './fontComponent/FontEditor';
import FontActions from './fontComponent/FontActions';
import useFontDownload from '@/hooks/useFontDownload';
import useFont from '@/hooks/useFont';
import useTextAreaRef from '@/hooks/useTextAreaRef';
import { useEffect } from 'react';

// props 타입을 인터페이스로 정의
interface FontDownloadProps {
  fontId: string;
}

// props를 객체 형태로 받도록 수정
function FontDownload({ fontId }: FontDownloadProps) {
  const { text, fontSize, setText, setFontSize } = useFont();

  const { downloadFont, resetFont, fontLoaded, fontFamily, fontName } =
    useFontDownload();

  const { currentFontFamily, setCurrentFontFamily } = useTextAreaRef();

  // 폰트가 로드되면 현재 폰트 패밀리 업데이트
  useEffect(() => {
    if (fontLoaded && fontFamily) {
      setCurrentFontFamily(fontFamily);
    }
  }, [fontLoaded, fontFamily, setCurrentFontFamily]);

  // 폰트 리셋 핸들러
  const handleReset = () => {
    resetFont(fontId);
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
        <div className="text-h3-lg font-p-700 mb-2">{fontName}</div>

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
