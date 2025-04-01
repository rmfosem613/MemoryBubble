import React, { useEffect, useState } from 'react';
import LetterCard from '@/components/storage/LetterCard';
import LetterAnimation from '@/components/storage/animation/LetterAnimation';
import { LetterData } from '@/types/Letter';
import apiClient from '@/apis/apiClient';

function ReceivedLetterContent() {
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [isAnimationOpen, setIsAnimationOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 편지 목록 가져오기
  const fetchLetters = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/letters');
      console.log(response.data, '편지 목록');

      if (response.data && Array.isArray(response.data)) {
        setLetters(response.data);
      }
      setError(null);
    } catch (error) {
      console.error('편지 목록 가져오기 실패:', error);
      setError('편지 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 처음 컴포넌트가 마운트될 때 편지 목록 가져오기
  useEffect(() => {
    fetchLetters();
  }, []);

  const handleLetterClick = async (letter: LetterData) => {
    try {
      // 편지 상세 정보 가져오기
      const response = await apiClient.get(`/api/letters/${letter.letterId}`);
      console.log(response.data, '편지 상세 정보');

      // 상세 정보로 선택된 편지 업데이트
      setSelectedLetter(response.data);
      setIsAnimationOpen(true);
    } catch (error) {
      console.error('편지 상세 정보 가져오기 실패:', error);
    }
  };

  const handleCloseAnimation = () => {
    setIsAnimationOpen(false);
    setTimeout(() => {
      setSelectedLetter(null);

      // 편지를 닫은 후 목록 새로고침
      fetchLetters();
    }, 800); // 애니메이션이 끝나는 시간과 맞춤
  };

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">편지를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 오류가 발생한 경우
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 편지가 없는 경우
  if (!letters || letters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">받은 편지가 없습니다.</p>
      </div>
    );
  }

  // 편지가 있는 경우 표시할 내용
  return (
    <>
      <div className="p-6 h-full overflow-y-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((letter, index) => (
            <LetterCard
              key={index}
              letter={letter}
              onClick={handleLetterClick}
            />
          ))}
        </div>
      </div>

      {/* 편지 애니메이션 컴포넌트 */}
      <LetterAnimation
        letter={selectedLetter}
        isOpen={isAnimationOpen}
        onClose={handleCloseAnimation}
      />
    </>
  );
}

export default ReceivedLetterContent;
