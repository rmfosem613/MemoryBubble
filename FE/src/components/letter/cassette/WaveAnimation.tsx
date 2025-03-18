import { useLetterStore } from '@/stores/useLetterStore';
import { COLORS } from '@/utils/letterUtils';

function WaveAnimation() {
  const { selectedColor } = useLetterStore();
  
  // 선택된 색상에 따라 파도 색상 결정 (기본값은 겨울 색상)
  const colorKey = selectedColor || 'winter';
  const waveColor = COLORS[colorKey].waveColor;

  return (
    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
      {/* 첫 번째 파도 */}
      <div 
        className="absolute top-[60%] left-[-30%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift"
        style={{ backgroundColor: waveColor }}
      ></div>
      <div 
        className="absolute top-[65%] left-[-30%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] animate-drift"
        style={{ backgroundColor: waveColor }}
      ></div>

      {/* 두 번째 파도 */}
      <div 
        className="absolute top-[60%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift"
        style={{ backgroundColor: waveColor }}
      ></div>
      <div 
        className="absolute top-[65%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] animate-drift"
        style={{ backgroundColor: waveColor }}
      ></div>

      {/* 세 번째 파도 */}
      <div 
        className="absolute top-[60%] left-[-90%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift"
        style={{ backgroundColor: waveColor }}
      ></div>
      <div 
        className="absolute top-[65%] left-[-90%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] animate-drift"
        style={{ backgroundColor: waveColor }}
      ></div>
    </div>
  );
}

export default WaveAnimation;