import React, { useState, useRef, useEffect } from 'react';

interface DropDownProps {
  albums: { id: number; title: string; photoCount: number }[];
  currentAlbumId?: number | null;
  onSelectAlbum: (albumId: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

function DropDown({ 
  albums, 
  currentAlbumId, 
  onSelectAlbum, 
  placeholder = '앨범을 선택해주세요',
  disabled = false
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{ id: number; title: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (currentAlbumId && albums.length > 0) {
      const album = albums.find(a => a.id === currentAlbumId);
      if (album) {
        setSelectedAlbum(album);
      }
    }
  }, [currentAlbumId, albums]);

  // 드롭다운 위치 계산
  useEffect(() => {
    if (dropdownRef.current && isOpen) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 드롭다운 목록의 너비는 원래 요소와 동일하게 설정
      const width = rect.width;

      // 화면 중앙에 위치하도록 계산
      const left = (windowWidth - width) / 2;
      const top = (windowHeight - 240) / 2; // 240px은 드롭다운 목록의 고정 높이

      setPosition({ top, left, width });
    }
  }, [isOpen]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // 앨범 선택 핸들러
  const handleSelectAlbum = (album: { id: number; title: string }) => {
    setSelectedAlbum(album);
    onSelectAlbum(album.id);
    setIsOpen(false);
  };

  // 드롭다운 토글 핸들러
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const availableAlbums = albums.filter((album) => album.id !== currentAlbumId);
  const noAlbumsAvailable = availableAlbums.length === 0;

  return (
    <div className="relative w-full mb-4" ref={dropdownRef}>
      {/* 선택된 항목 표시 영역 */}
      <div
        className={`flex items-center justify-between w-full p-3 border border-gray-300 rounded-md ${
          disabled || noAlbumsAvailable ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={toggleDropdown}
      >
        <span className={`${disabled || noAlbumsAvailable ? 'text-gray-500' : 'text-gray-700'}`}>
          {disabled || noAlbumsAvailable
            ? "추억보관함"
            : selectedAlbum 
              ? selectedAlbum.title 
              : placeholder}
        </span>
        {!disabled && !noAlbumsAvailable && (
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
        )}
      </div>

      {/* 드롭다운 목록 - 화면 중앙에 고정 위치 */}
      {isOpen && !disabled && !noAlbumsAvailable && (
        <div
          className="mt-[-25px] fixed z-50 bg-white border border-gray-300 rounded-md overflow-auto"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            height: '260px',
          }}
        >
          {availableAlbums.length > 0 ? (
            availableAlbums.map((album, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectAlbum(album)}
              >
                {album.title}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">추억 보관함</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DropDown;