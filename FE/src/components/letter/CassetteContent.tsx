import { useState, useRef, useEffect } from 'react';
import Cassette from '@/assets/letter/cassette-1.svg';
import Cassette2 from '@/assets/letter/cassette-2.svg';
import Cassette3 from '@/assets/letter/cassette-3.svg';
import Cassette4 from '@/assets/letter/cassette-4.svg';
import CassetteReel from '@/assets/letter/cassette-reel.svg';
import WaveAnimation from './WaveAnimation';
import { Circle, Headset, Square, RefreshCcw } from 'lucide-react';
import { useLetterStore } from '@/stores/useLetterStore';

function CassetteContent() {
  const { selectedColor, cassetteData, updateCassetteData } = useLetterStore();
  
  // 녹음 상태 관리
  const [recordState, setRecordState] = useState<'inactive' | 'recording' | 'recorded'>('inactive');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0); // 초 단위
  const [currentTime, setCurrentTime] = useState(0); // 초 단위 
  const [progressWidth, setProgressWidth] = useState(0); // 프로그레스 바 너비 (0-100%)
  
  // 녹음 관련 참조
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // 최대 녹음 시간 (초)
  const MAX_RECORDING_TIME = 300; // 5분

  // 선택된 색상에 따라 카세트 이미지 변경
  const getCassetteImage = () => {
    switch (selectedColor) {
      case 'summer':
        return Cassette2; // 여름
      case 'spring':
        return Cassette3; // 봄
      case 'autumn':
        return Cassette4; // 가을
      case 'winter':
      default:
        return Cassette; // 겨울 또는 기본값
    }
  };

  // 녹음 시작 함수
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          updateCassetteData({ 
            isRecorded: true, 
            recordingUrl: audioUrl,
            recordingDuration: recordedTime
          });
        }
        
        // 스트림 트랙 중지
        stream.getTracks().forEach(track => track.stop());
      };
      
      // 녹음 시작
      mediaRecorder.start();
      setRecordState('recording');
      setCurrentTime(0);
      
      // 타이머 시작
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          setProgressWidth((newTime / MAX_RECORDING_TIME) * 100);
          
          // 최대 녹음 시간 도달 시 녹음 중지
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
          }
          
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error('녹음을 시작할 수 없습니다:', error);
    }
  };

  // 녹음 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecordState('recorded');
      setRecordedTime(currentTime);
      
      // 타이머 중지
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 녹음 초기화 함수
  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    // 타이머 정리
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setRecordState('inactive');
    setIsPlaying(false);
    setCurrentTime(0);
    setRecordedTime(0);
    setProgressWidth(0);
    updateCassetteData({ isRecorded: false, recordingUrl: null, recordingDuration: 0 });
  };

  // 녹음 재생 함수
  const playRecording = () => {
    if (audioRef.current && recordState === 'recorded') {
      if (isPlaying) {
        // 정지 (일시정지)
        audioRef.current.pause();
        setIsPlaying(false);
        
        // 타이머 중지
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // 처음부터 또는 멈췄던 지점부터 재생
        audioRef.current.play();
        setIsPlaying(true);
        
        // 재생 타이머 시작
        timerRef.current = window.setInterval(() => {
          if (audioRef.current) {
            const currentSec = Math.floor(audioRef.current.currentTime);
            setCurrentTime(currentSec);
            setProgressWidth((currentSec / recordedTime) * 100);
          }
        }, 100);
      }
    }
  };

  // 오디오 재생 종료 감지
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgressWidth(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const createAudioElement = () => {
      if (audioRef.current) {
        audioRef.current.addEventListener('ended', handleAudioEnded);
      }
    };

    createAudioElement();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
      
      // 컴포넌트 언마운트 시 타이머 정리
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 시간 포맷 함수 (초 -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="border-2 border-gray-300 rounded-[8px] p-5 h-[95.5%] relative overflow-hidden w-[100%] flex">
      {/* 숨겨진 오디오 요소 */}
      <audio ref={audioRef} />

      {/* 카세트 이미지 */}
      <div className='flex h-full w-full justify-center mt-[-50px]'>
        <div className='mt-[80px] h-[234px]'>
          <img src={getCassetteImage()} className='relative z-10 w-[400px] h-full' />
          <img 
            src={CassetteReel} 
            className={`relative w-[44px] z-10 ${isPlaying || recordState === 'recording' ? 'animate-spin-slow' : ''} 
            top-[-149px] left-[24%] sm:left-[93px] md:left-[99px]`} 
          />
          <img 
            src={CassetteReel} 
            className={`relative w-[44px] z-10 ${isPlaying || recordState === 'recording' ? 'animate-spin-slow' : ''} 
            top-[-192px] ml-[-15px] sm:ml-0 left-[68%] sm:left-[249px] md:left-[257px]`} 
          />

          {/* 카세트 보낸이 */}
          <div className='relative z-30 flex justify-center top-[-315px] h-full p-[25px]'>
            <div className='absolute bg-white w-0 sm:w-[120px] h-[20px]' />
            <div className='relative bg-white w-0 sm:w-[120px] h-[20px] ml-[10px] mt-[15px]' />
          </div>

          <div className='relative z-30 flex justify-center top-[-520px] w-full h-0 sm:h-[130px] overflow-hidden'>
            <p className='absolute font-p-700 text-h4-lg'>From. 아빠</p>
            <p className='relative text-gray-600 mt-[110px] ml-[250px] text-p-lg'>2024.03.17</p>
          </div>
        </div>
      </div>

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

      {/* 파도 애니메이션 컴포넌트 */}
      <WaveAnimation />

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        @keyframes drift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-drift {
          animation: drift 25s infinite linear;
        }
      `}</style>
    </div >
  );
};

export default CassetteContent;