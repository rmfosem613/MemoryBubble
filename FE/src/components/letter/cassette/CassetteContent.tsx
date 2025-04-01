import { useState } from 'react';
import WaveAnimation from './WaveAnimation';
import CassettePlayer from './CassettePlayer';
import CassetteImage from './CassetteImage';
import AnimationStyles from './AnimationStyles';
import LetterContainer from '../common/LetterContainer';

interface CassetteContentProps {
  selectedDate?: Date | null;
}

function CassetteContent({ selectedDate }: CassetteContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // 재생 또는 녹음 중일 때 릴 회전 애니메이션
  const isRecordingOrPlaying = isPlaying || isRecording;

  return (
    <LetterContainer className="h-[95.5%] w-[100%] flex">
      {/* 카세트 이미지 컴포넌트 */}
      <CassetteImage
        isRecordingOrPlaying={isRecordingOrPlaying}
        selectedDate={selectedDate}
      />

      {/* 녹음 및 재생 컨트롤 컴포넌트 */}
      <CassettePlayer
        onPlayingChange={setIsPlaying}
        onRecordingChange={setIsRecording}
      />

      {/* 파도 애니메이션 컴포넌트 */}
      <WaveAnimation />

      {/* 애니메이션 스타일 */}
      <AnimationStyles />
    </LetterContainer>
  );
}

export default CassetteContent;