import React, { useState, useRef, useEffect } from 'react';
import useAlbumStore from '@/stores/useAlbumStore';

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const { albums, currentAlbum } = useAlbumStore();
  const [selectedAlbum, setSelectedAlbum] = useState(currentAlbum || { title: '추억보관함' });
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // 앨범 선택 핸들러
  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mb-4" ref={dropdownRef}>
      {/* 선택된 항목 표시 영역 */}
      <div 
        className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">{selectedAlbum.title}</span>
        <svg 
          className={`w-5 h-5 text-gray-600 transform ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* 드롭다운 목록 */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-[-247px] h-[240px] bg-white border border-gray-300 rounded-md max-h-60 overflow-auto">
          {albums && albums.length > 0 ? (
            albums.map((album, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectAlbum(album)}
              >
                {album.title}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">추억보관함</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DropDown;