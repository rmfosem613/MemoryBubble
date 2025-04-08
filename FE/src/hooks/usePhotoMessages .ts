import { useState, useRef, useEffect } from 'react';
import apiClient from '@/apis/apiClient';
import { Photo } from './usePhotoAlbum'; // Photo 인터페이스 임포트

// 통합 메시지 인터페이스 정의
export interface Message {
  id: string;
  type: 'text' | 'audio';
  content: string; // 텍스트 메시지 내용 또는 오디오 URL
  timestamp: string;
  isPlaying?: boolean; // 오디오 메시지 재생 상태 (오디오인 경우만 사용)
}

export const usePhotoMessages = (photos?: Photo[], currentIndex?: number) => {
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

      // 컴포넌트 언마운트 시 미디어 리소스 정리
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }

      // MediaRecorder 참조 정리
      mediaRecorderRef.current = null;
    };
  }, [currentlyPlayingId, messages.length]);

  const handleSaveMessage = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.stopPropagation();

    // 메시지가 비어있는지 확인
    if (postcardMessage.trim() === '') {
      // 빈 메시지인 경우 알림 표시
      alert('메시지를 입력해주세요.');

      // 입력 필드에 포커스
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
      return; // 함수 실행 중단
    }

    try {
      // photos와 currentIndex가 유효한 경우에만 API 요청
      if (photos && currentIndex !== undefined && photos.length > 0) {
        const currentPhotoId = photos[currentIndex].id;

        // API 요청 데이터 형식
        const messageData = {
          type: 'TEXT',
          content: postcardMessage,
        };

        // API 요청 보내기
        const response = await apiClient.post(
          `/api/photos/${currentPhotoId}/review`,
          messageData,
        );
        console.log('메시지 전송 성공:', response.data);
      }

      // 로컬 메시지 상태 업데이트 (기존 로직)
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
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // 에러 처리 로직 추가 가능
    }
  };

  // 메시지 목록 새로고침 함수
  const refreshMessages = async () => {
    if (photos && currentIndex !== undefined && photos.length > 0) {
      try {
        const currentPhotoId = photos[currentIndex].id;
        const response = await apiClient.get(`/api/photos/${currentPhotoId}`);
        if (response.data && Array.isArray(response.data)) {
          // 서버에서 가져온 메시지 목록 설정 (이 함수를 호출한 컴포넌트에서 처리)
          return response.data;
        }
      } catch (error) {
        console.error('메시지 목록 업데이트 실패:', error);
      }
    }
    return null;
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
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          return;
        }

        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        console.log('녹음된 오디오 Blob:', audioBlob);
        console.log('오디오 Blob 크기:', audioBlob.size, 'bytes');
        console.log('오디오 MIME 타입:', audioBlob.type);

        if (audioBlob.size === 0) {
          return;
        }

        try {
          // 현재 사진 ID 가져오기
          if (photos && currentIndex !== undefined && photos.length > 0) {
            const currentPhotoId = photos[currentIndex].id;

            // 1. AUDIO 타입의 메시지 생성 요청
            const messageData = {
              type: 'AUDIO',
              content: null,
            };

            // API 요청 보내기
            const response = await apiClient.post(
              `/api/photos/${currentPhotoId}/review`,
              messageData,
            );

            console.log('오디오 메시지 생성 성공:', response.data);

            // 2. 받은 presignedUrl에 오디오 파일 업로드
            const { presignedUrl } = response.data;

            console.log('생성된 presignedUrl:', presignedUrl);

            // 3. presignedUrl에 PUT 요청으로 파일 업로드
            const uploadResponse = await fetch(presignedUrl, {
              method: 'PUT',
              body: audioBlob,
              headers: {
                'Content-Type': audioBlob.type,
              },
            });

            if (!uploadResponse.ok) {
              throw new Error(
                `Upload failed with status: ${uploadResponse.status}`,
              );
            }

            console.log('오디오 파일 업로드 성공!');

            // 4. 새로운 메시지 목록 가져오기 시도
            const updatedMessages = await refreshMessages();
            return updatedMessages;
          }

          // 스트림 트랙 중지
          if (mediaRecorder && mediaRecorder.stream) {
            const tracks = mediaRecorder.stream.getTracks();
            tracks.forEach((track) => {
              track.stop();
            });
          }
        } catch (error) {
          console.error('오디오 메시지 처리 실패:', error);

          // 오류 발생 시 로컬에서라도 재생할 수 있도록 URL 생성
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('생성된 오디오 URL (로컬):', audioUrl);

          // 로컬 메시지 추가
          const newAudioMessage: Message = {
            id: generateId(),
            type: 'audio',
            content: audioUrl,
            timestamp: new Date().toLocaleString(),
            isPlaying: false,
          };

          setMessages((prev) => [...prev, newAudioMessage]);
          alert('오디오 업로드에 실패했습니다. 네트워크 연결을 확인해주세요.');
        }

        // 스트림 트랙 중지
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
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

      // 백업 중지 메커니즘
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          const tracks = mediaRecorderRef.current.stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
          });
        }
      }, 300);

      setIsRecording(false);
    } else {
      setIsRecording(false);
    }
  };

  // 오디오 재생 또는 일시정지 함수 - 수정된 버전
  const toggleAudioPlayback = (messageIdOrUrl: string, isDirectUrl = false) => {
    // 직접 URL인 경우와 메시지 ID인 경우를 구분하여 처리
    let audioUrl: string;
    let messageId: string;

    if (isDirectUrl) {
      // 직접 URL이 전달된 경우
      audioUrl = messageIdOrUrl;
      messageId = messageIdOrUrl; // URL 자체를 ID로 사용
    } else {
      // 메시지 ID가 전달된 경우 (기존 로직)
      const audioMessage = messages.find((msg) => msg.id === messageIdOrUrl);
      if (!audioMessage || audioMessage.type !== 'audio') {
        return;
      }

      // 오디오 URL이 유효하지 않은 경우 (blob: 체크 제거)
      if (!audioMessage.content) {
        return;
      }

      audioUrl = audioMessage.content;
      messageId = messageIdOrUrl;
    }

    // 이미 재생 중인 경우 일시정지
    if (currentlyPlayingId === messageId) {
      try {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }

        if (!isDirectUrl) {
          // 메시지 ID인 경우만 메시지 상태 업데이트
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, isPlaying: false } : msg,
            ),
          );
        }

        setCurrentlyPlayingId(null);
      } catch (error) {
        console.error('오디오 일시정지 중 오류:', error);
      }
    }
    // 재생 시작
    else {
      // 이미 재생 중인 다른 오디오가 있으면 중지
      if (currentlyPlayingId) {
        try {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }

          if (!isDirectUrl) {
            // 메시지 ID인 경우만 메시지 상태 업데이트
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === currentlyPlayingId
                  ? { ...msg, isPlaying: false }
                  : msg,
              ),
            );
          }
        } catch (error) {
          console.error('기존 오디오 중지 중 오류:', error);
        }
      }

      try {
        const newAudio = new Audio();

        // 오류 이벤트 리스너 추가
        newAudio.onerror = () => {
          // 오류 발생 시 상태 정리
          if (!isDirectUrl) {
            // 메시지 ID인 경우만 메시지 상태 업데이트
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === messageId ? { ...msg, isPlaying: false } : msg,
              ),
            );
          }
          setCurrentlyPlayingId(null);
        };

        // 재생 완료 이벤트 리스너 추가
        newAudio.onended = () => {
          if (!isDirectUrl) {
            // 메시지 ID인 경우만 메시지 상태 업데이트
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === messageId ? { ...msg, isPlaying: false } : msg,
              ),
            );
          }
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
              if (!isDirectUrl) {
                // 메시지 ID인 경우만 메시지 상태 업데이트
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, isPlaying: true } : msg,
                  ),
                );
              }

              setCurrentlyPlayingId(messageId);
            })
            .catch((error) => {
              console.error('오디오 재생 실패:', error);
              // 오류 발생 시 상태 정리
              if (!isDirectUrl) {
                // 메시지 ID인 경우만 메시지 상태 업데이트
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, isPlaying: false } : msg,
                  ),
                );
              }
            });
        };

        // src 설정 및 로드 시작
        newAudio.src = audioUrl;
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
    refreshMessages,
  };
};
