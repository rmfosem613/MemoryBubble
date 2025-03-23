import { useState, useRef, useEffect } from 'react';

// 통합 메시지 인터페이스 정의
export interface Message {
  id: string;
  type: 'text' | 'audio';
  content: string; // 텍스트 메시지 내용 또는 오디오 URL
  timestamp: string;
  isPlaying?: boolean; // 오디오 메시지 재생 상태 (오디오인 경우만 사용)
}

export const usePhotoMessages = () => {
  const [postcardMessage, setPostcardMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null,
  );

  const messageInputRef = useRef(null);

  // 녹음 관련 참조
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  // 고유 ID 생성 함수
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // 컴포넌트 마운트 시 오디오 객체 초기화
  useEffect(() => {
    if (!audioPlayerRef.current) {
      const audio = new Audio();
      audio.autoplay = false;
      audioPlayerRef.current = audio;
    }

    const handlePlaybackEnded = () => {
      if (currentlyPlayingId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === currentlyPlayingId ? { ...msg, isPlaying: false } : msg,
          ),
        );
        setCurrentlyPlayingId(null);
      }
    };

    const player = audioPlayerRef.current;

    // 오디오 이벤트 콜백 설정
    player.addEventListener('ended', handlePlaybackEnded);

    return () => {
      player.removeEventListener('ended', handlePlaybackEnded);
      player.pause();

      // 생성된 URL 해제
      messages.forEach((message) => {
        if (message.type === 'audio' && message.content) {
          try {
            URL.revokeObjectURL(message.content);
          } catch (error) {
            console.log(error);
          }
        }
      });
    };
  }, [currentlyPlayingId, messages.length]);

  const handleSaveMessage = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.stopPropagation();
    if (postcardMessage.trim() !== '') {
      // 텍스트 메시지 추가
      const newTextMessage: Message = {
        id: generateId(),
        type: 'text',
        content: postcardMessage,
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prev) => [...prev, newTextMessage]);
      setPostcardMessage('');

      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  };

  // 녹음 시작 함수
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 지원되는 MIME 타입으로 설정
      let mediaRecorder;
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
      } else {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 오디오 데이터 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 완료 시
      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          return;
        }

        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size === 0) {
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);

        // 재생 가능 확인 후 메시지 추가
        const testAudio = new Audio(audioUrl);
        testAudio.oncanplay = () => {
          const newAudioMessage: Message = {
            id: generateId(),
            type: 'audio',
            content: audioUrl,
            timestamp: new Date().toLocaleString(),
            isPlaying: false,
          };

          setMessages((prev) => [...prev, newAudioMessage]);
        };

        testAudio.onerror = () => {
          alert('오디오 녹음에 문제가 있습니다. 다시 시도해보세요.');
        };

        // 스트림 트랙 중지
        stream.getTracks().forEach((track) => track.stop());
      };

      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('녹음을 시작할 수 없습니다:', error);
    }
  };

  // 녹음 중지 함수
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 오디오 재생 또는 일시정지 함수
  const toggleAudioPlayback = (messageId: string) => {
    const audioMessage = messages.find((msg) => msg.id === messageId);
    if (!audioMessage || audioMessage.type !== 'audio') {
      return;
    }

    // 오디오 URL이 유효하지 않은 경우
    if (!audioMessage.content || !audioMessage.content.startsWith('blob:')) {
      return;
    }

    // 이미 재생 중인 경우 일시정지
    if (audioMessage.isPlaying) {
      try {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, isPlaying: false } : msg,
          ),
        );

        setCurrentlyPlayingId(null);
      } catch (error) {
        console.error('오디오 일시정지 중 오류:', error);
      }
    }
    // 재생 시작
    else {
      // 이미 재생 중인 다른 오디오가 있으면 중지
      if (currentlyPlayingId && currentlyPlayingId !== messageId) {
        try {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === currentlyPlayingId
                ? { ...msg, isPlaying: false }
                : msg,
            ),
          );
        } catch (error) {
          console.error('기존 오디오 중지 중 오류:', error);
        }
      }

      try {
        const newAudio = new Audio();

        // 오류 이벤트 리스너 추가
        newAudio.onerror = () => {
          // 오류 발생 시 상태 정리
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, isPlaying: false } : msg,
            ),
          );
          setCurrentlyPlayingId(null);
        };

        // 재생 완료 이벤트 리스너 추가
        newAudio.onended = () => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, isPlaying: false } : msg,
            ),
          );
          setCurrentlyPlayingId(null);
        };

        // 재생 가능 상태 도달 시 재생 시작
        newAudio.oncanplay = () => {
          // 명시적으로 볼륨 설정
          newAudio.volume = 1.0;

          // 재생 시작
          newAudio
            .play()
            .then(() => {
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === messageId ? { ...msg, isPlaying: true } : msg,
                ),
              );

              setCurrentlyPlayingId(messageId);
            })
            .catch(() => {
              // 오류 발생 시 상태 정리
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === messageId ? { ...msg, isPlaying: false } : msg,
                ),
              );
            });
        };

        // src 설정 및 로드 시작
        newAudio.src = audioMessage.content;
        newAudio.load();

        // 기존 오디오 객체 정리 후 새 객체로 교체
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.src = '';
        }
        audioPlayerRef.current = newAudio;
      } catch (error) {
        console.error('오디오 객체 생성 중 오류:', error);
      }
    }
  };

  // 녹음 버튼 클릭 핸들러
  const handleRecordButtonClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // 메시지 시간순 정렬 (최신 메시지가 아래에 위치)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return {
    postcardMessage,
    setPostcardMessage,
    messages,
    isRecording,
    currentlyPlayingId,
    messageInputRef,
    handleSaveMessage,
    startRecording,
    stopRecording,
    toggleAudioPlayback,
    handleRecordButtonClick,
    sortedMessages,
  };
};
