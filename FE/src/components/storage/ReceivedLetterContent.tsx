import React, { useState } from 'react';
import LetterCard from '@/components/storage/LetterCard';
import LetterAnimation from '@/components/storage/animation/LetterAnimation';
import { LetterData } from '@/types/Letter';


const mockLetters: LetterData[] = [
  {
    'type': 'letter',
    'color': 'autumn',
    'name': '아빠',
    'state': '안읽음',
    'date': '2025.01.17',
    contents: '항상 건강하기를 바래. <br/> 사랑한다 우리 딸 <br/> 사랑한다 우리 가족 <br/> 항상 건강하고, 항상 좋은 일만 가득하길'
  },
  {
    'type': 'cassette',
    'color': 'winter',
    'name': '엄마',
    'state': '읽음',
    'date': '2025.01.15'
  },
  {
    'type': 'letter',
    'color': 'summer',
    'name': '엄마',
    'state': '읽음',
    'date': '2025.01.15',
    contents: '딸 요즘 연락이 뜸해 <br/> 엄마 서운해 <br/> 항상 건강하고 <br/> 사랑해'
  },
];

function ReceivedLetterContent() {
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [isAnimationOpen, setIsAnimationOpen] = useState<boolean>(false);
  
  const letters = mockLetters;

  const handleLetterClick = (letter: LetterData) => {
    setSelectedLetter(letter);
    setIsAnimationOpen(true);
    
    // 읽음 상태로 업데이트 (실제 구현에서는 API 호출 등이 필요할 수 있음)
    if (letter.state === '안읽음') {
      const updatedLetters = [...letters];
      const index = updatedLetters.findIndex(
        (l) => l.name === letter.name && l.date === letter.date && l.type === letter.type
      );
      if (index !== -1) {
        updatedLetters[index] = { ...letter, state: '읽음' };
        // 상태 업데이트 로직 (실제 구현 필요)
      }
    }
  };

  const handleCloseAnimation = () => {
    setIsAnimationOpen(false);
    setTimeout(() => {
      setSelectedLetter(null);
    }, 800); // 애니메이션이 끝나는 시간과 맞춤
  };

  // 편지가 없는 경우 표시할 내용
  if (!letters || letters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">아직 받은 편지가 없습니다.</p>
      </div>
    );
  }

  // 편지가 있는 경우 표시할 내용
  return (
    <>
      <div className="p-6">
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