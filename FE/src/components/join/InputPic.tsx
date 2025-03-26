import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';

function InputPic({ onImageChange, imageError }) {
  const [image, setImage] = useState(null); // 이미지 파일 상태
  const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기 URL 상태
  const fileInputRef = useRef(null); // 파일 입력 참조

  // 이미지 파일이 변경되었을 때 처리하는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 첫 번째 파일 선택
    if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
      setImage(file); // 이미지 상태 설정
      
      // 이미지 미리보기 URL 생성
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result); // 미리보기 URL 상태 설정
      };
      fileReader.readAsDataURL(file); // 파일을 데이터 URL로 읽기

      // 부모 컴포넌트로 파일 전달
      onImageChange(file);
    }
  };

  // 버튼 클릭 시 파일 입력 열기
  const handleButtonClick = () => {
    fileInputRef.current.click(); // 파일 입력 클릭
  };

  // 드래그 오버 시 기본 동작 방지
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 동작을 막아줌
  };

  // 드래그 앤 드롭 처리
  const handleDrop = (e) => {
    e.preventDefault(); // 기본 동작 방지
    const file = e.dataTransfer.files[0]; // 드래그한 파일
    if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
      setImage(file); // 이미지 상태 설정

      // 이미지 미리보기 URL 생성
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result); // 미리보기 URL 상태 설정
      };
      fileReader.readAsDataURL(file); // 파일을 데이터 URL로 읽기

      // 부모 컴포넌트로 파일 전달
      onImageChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 h-[300px]">
      
      {/* 숨겨진 파일 입력 */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*" // 이미지 파일만 선택 가능
        onChange={handleImageChange} // 이미지 변경 시 처리 함수
      />

      {/* 이미지 미리보기 또는 업로드 박스 */}
      {previewUrl ? (
        <div className="relative w-40 h-40">
          <img 
            src={previewUrl} 
            alt="Profile Preview" 
            className="w-40 h-40 rounded-full object-cover border-4"
          />
          {/* 업로드 버튼 */}
          <div 
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleButtonClick} // 업로드 버튼 클릭 시 파일 선택
          >
            <Upload size={16} className="text-white" />
          </div>
        </div>
      ) : (
        <div 
          className="w-40 h-40 rounded-full border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleButtonClick} // 업로드 박스 클릭 시 파일 선택
          onDragOver={handleDragOver} // 드래그 오버 시 처리
          onDrop={handleDrop} // 드래그 앤 드롭 시 처리
        >
          <Upload size={32} className="text-gray-600 mb-2" />
          <p className="text-sm text-gray-600">클릭하거나 드래그</p>
        </div>
      )}

      {/* 프로필 사진 설명 */}
      <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-2">프로필 사진을 통해 본인을 표현해 주세요</p>
      
      {/* 이미지 오류 메시지 */}
      {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
    </div>
  );
}

export default InputPic;
