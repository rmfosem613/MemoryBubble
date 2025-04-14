import { ColorOption, ColorTheme } from '@/types/Letter';

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: ColorTheme;
  onSelectColor: (colorId: string) => void;
}

function ColorSelector({ colors, selectedColor, onSelectColor }: ColorSelectorProps) {
  return (
    <div className="flex justify-between items-center border border-gray-300 h-[50px] rounded-[8px] mr-[12px] mb-[10px] pl-[10px] pr-[10px]">
      {colors.map((color) => (
        <div 
          key={color.id}
          className={`flex justify-center items-center w-[30px] h-[30px] ${color.className} rounded-full cursor-pointer ${
            selectedColor === color.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          onClick={() => onSelectColor(color.id!)}
        />
      ))}
    </div>
  );
}

export default ColorSelector;