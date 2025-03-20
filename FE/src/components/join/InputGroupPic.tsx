import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

function InputGroupPic() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 h-[300px]">
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Image preview or upload box */}
      {previewUrl ? (
        <div className="relative w-[400px] h-[300px]">
          <img 
            src={previewUrl} 
            alt="Profile Preview" 
            className="object-cover"
          />
        </div>
      ) : (
        <div 
          className="w-[400px] h-[300px] border border-gray-600 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleButtonClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload size={32} className="text-gray-600 mb-2" />
          <p className="text-sm text-gray-600">클릭하거나 드래그</p>
        </div>
      )}

      <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-2">그룹을 대표할 사진을 선택해주세요</p>
 
    </div>
  );
}

export default InputGroupPic;