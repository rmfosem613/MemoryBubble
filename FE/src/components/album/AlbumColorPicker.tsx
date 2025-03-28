import React from 'react';

interface ColorOption {
  id: number;
  value: string;
  class: string;
}

interface AlbumColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  colorOptions?: ColorOption[];
}

const AlbumColorPicker: React.FC<AlbumColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  colorOptions
}) => {
  // 기본 색상 옵션
  const defaultColorOptions: ColorOption[] = [
    { id: 1, value: "#f4e2dc", class: "bg-album-100" },
    { id: 2, value: "#f3d1b2", class: "bg-album-200" },
    { id: 3, value: "#f7f0d5", class: "bg-album-300" },
    { id: 4, value: "#bfdaab", class: "bg-album-400" },
    { id: 5, value: "#c5dfe6", class: "bg-album-500" },
    { id: 6, value: "#b3c6e3", class: "bg-album-600" }
  ];

  // 사용할 색상 옵션 (제공된 것이 없으면 기본값 사용)
  const options = colorOptions || defaultColorOptions;

  return (
    <div className="flex space-x-3 mt-[12px] mb-[8px]">
      {options.map((color) => (
        <div
          key={color.id}
          className={`w-[35px] h-[35px] rounded-full ${color.class} cursor-pointer
            ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
          `}
          onClick={() => onColorSelect(color.value)}
        ></div>
      ))}
    </div>
  );
};

export default AlbumColorPicker;