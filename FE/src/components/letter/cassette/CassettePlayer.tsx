import { Circle, Square, RefreshCcw, Headset } from 'lucide-react';
import { useRecorder } from '@/hooks/useRecorder';

interface CassettePlayerProps {
  onPlayingChange: (isPlaying: boolean) => void;
  onRecordingChange: (isRecording: boolean) => void;
}

function CassettePlayer({ onPlayingChange, onRecordingChange }: CassettePlayerProps) {
  const [
    { recordState, isPlaying, recordedTime, currentTime, progressWidth },
    { startRecording, stopRecording, resetRecording, playRecording, formatTime }
  ] = useRecorder(onPlayingChange, onRecordingChange);

  return (
    <>
      {/* 녹음 progress bar */}
      <div className='absolute z-20 top-0 h-full w-full flex justify-center left-0'>
        <div className='absolute flex top-[320px] w-[400px]'>
          <div className='relative h-[10px] w-full bg-gray-200 rounded-full'></div>
          {/* 녹음/재생 진행 표시 */}
          <div 
            className='absolute h-[10px] bg-gray-700 rounded-full transition-all duration-100 ease-linear'
            style={{ width: `${progressWidth}%` }}
          ></div>
          {/* 시간 표시 */}
          <p className='absolute left-0 top-[20px] text-sm'>
            {recordState === 'recording' || isPlaying ? formatTime(currentTime) : '0:00'}
          </p>
          <p className='absolute right-0 top-[20px] text-sm'>
            {recordState === 'recorded' ? formatTime(recordedTime) : '5:00'}
          </p>
        </div>
      </div>

      {/* 녹음 컨트롤 */}
      <div className='absolute top-[400px] z-20 w-full justify-center ml-[-23px] flex mt-[-30px]'>
        <div className='absolute bg-white border-[1px] border-gray-500 w-[250px] h-[50px] rounded grid grid-cols-2'>
          <div className='flex justify-center items-center'>
            {recordState === 'inactive' && (
              <Circle 
                fill='#F5535E' 
                strokeWidth={0} 
                width={'25px'} 
                height={'25px'} 
                className='cursor-pointer' 
                onClick={startRecording} 
              />
            )}
            {recordState === 'recording' && (
              <Square 
                fill='#F5535E' 
                strokeWidth={0} 
                width={'25px'} 
                height={'25px'} 
                className='cursor-pointer' 
                onClick={stopRecording} 
              />
            )}
            {recordState === 'recorded' && (
              <RefreshCcw 
                color='#F5535E' 
                width={'25px'} 
                height={'25px'} 
                className='cursor-pointer' 
                onClick={resetRecording} 
              />
            )}
          </div>
          <div className='flex justify-center items-center'>
            {!isPlaying ? (
              <Headset 
                color={recordState === 'recorded' ? '#3E404C' : '#9D9D9D'} 
                width={'25px'} 
                height={'25px'} 
                className={`${recordState === 'recorded' ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
                onClick={playRecording} 
              />
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="25" 
                height="25" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#3E404C" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="cursor-pointer"
                onClick={playRecording}
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            )}
          </div>
          <div className="absolute top-[10px] bottom-[10px] left-1/2 w-[2px] bg-gray-300"></div>
        </div>
      </div>
    </>
  );
}

export default CassettePlayer;