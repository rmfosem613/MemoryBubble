import { useState, useRef, useEffect } from 'react';
import { useLetterStore } from '@/stores/useLetterStore';
import { MAX_RECORDING_TIME } from '@/utils/letterUtils';

export interface RecorderState {
  recordState: 'inactive' | 'recording' | 'recorded';
  isPlaying: boolean;
  recordedTime: number;
  currentTime: number;
  progressWidth: number;
}

export interface RecorderActions {
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  playRecording: () => void;
  formatTime: (seconds: number) => string;
}

// 마이크 스트림 정리 함수
const cleanupMediaStream = (stream: MediaStream | null) => {
  if (!stream) return;

  try {
    stream.getTracks().forEach(track => {
      track.enabled = false; // 빠른 비활성화
      track.stop();          // 완전한 정리
    });
    console.log('오디오 트랙 중지 및 리소스 해제 완료');
  } catch (error) {
    console.error('스트림 정리 중 오류:', error);
  }
};

// 오디오 녹음 및 재생 기능을 제공하는 커스텀 훅
export function useRecorder(
  onPlayingChange: (isPlaying: boolean) => void,
  onRecordingChange: (isRecording: boolean) => void
): [RecorderState, RecorderActions] {
  const { cassetteData, updateCassetteData, letterType } = useLetterStore();

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
  const streamRef = useRef<MediaStream | null>(null);

  // 시간 포맷 함수
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (letterType === 'TEXT' && recordState === 'recording') {
      stopRecording();
      resetRecording();
    }
  }, [letterType]);

  // 녹음 시작 함수 - 권한 처리는 상위 컴포넌트에서 수행
  const startRecording = async () => {
    try {
      // 이전 스트림이 있다면 정리
      cleanupMediaStream(streamRef.current);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 오디오 데이터 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 완료
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          updateCassetteData({
            isRecorded: true,
            isRecording: false,
            recordingUrl: audioUrl,
            recordingDuration: recordedTime
          });
        }
      };

      // 녹음 시작
      mediaRecorder.start();
      setRecordState('recording');
      setCurrentTime(0);
      onRecordingChange(true);

      updateCassetteData({
        ...cassetteData,
        isRecording: true
      });

      // 타이머 시작
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

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
      onRecordingChange(false);

      // 타이머 중지
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 트랙 비활성화(마이크 엑세스 표시가 더 빨리 사라짐)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.enabled = false;
        });
      }

      // 브라우저 마이크 완전히 해제 - 모든 트랙 중지
      cleanupMediaStream(streamRef.current);
      streamRef.current = null;
    }
  };

  // 녹음 초기화 함수
  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // 마이크 해제 확인
    cleanupMediaStream(streamRef.current);
    streamRef.current = null;

    // 타이머 정리
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // MediaRecorder 정리
    mediaRecorderRef.current = null;

    setRecordState('inactive'); // 녹음 상태 비활성화
    setIsPlaying(false);
    onPlayingChange(false);
    setCurrentTime(0); // 시간 초기화
    setRecordedTime(0);
    setProgressWidth(0);
    updateCassetteData({ isRecorded: false, isRecording: false, recordingUrl: null, recordingDuration: 0 });
  };

  // 녹음 재생 함수
  const playRecording = () => {
    if (audioRef.current && recordState === 'recorded') {
      if (isPlaying) {
        // 정지 (일시정지)
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayingChange(false);

        // 타이머 중지
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // 처음부터 또는 멈췄던 지점부터 재생
        audioRef.current.play();
        setIsPlaying(true);
        onPlayingChange(true);

        // 재생 타이머 시작
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

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

  // 오디오 재생 종료 감지 및 정리
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
      onPlayingChange(false);
      setCurrentTime(0);
      setProgressWidth(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // 새로운 Audio 생성
    const createAudioElement = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.addEventListener('ended', handleAudioEnded);
    };
    createAudioElement();

    // 컴포넌트 마운트 시 마이크 상태 확인 및 정리
    cleanupMediaStream(streamRef.current);

    return () => {
      // 오디오 제거
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      // 컴포넌트 언마운트 시 타이머 정리
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 컴포넌트 언마운트 시 마이크 완전히 해제
      cleanupMediaStream(streamRef.current);
      streamRef.current = null;

      // MediaRecorder 정리
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          // 이미 정지된 상태에서 stop 호출 시 오류 무시
        }
      }
      mediaRecorderRef.current = null;
    };
  }, [onPlayingChange]);

  return [
    { recordState, isPlaying, recordedTime, currentTime, progressWidth },
    { startRecording, stopRecording, resetRecording, playRecording, formatTime }
  ];
}