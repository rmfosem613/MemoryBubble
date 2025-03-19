import LetterCard from '@/components/storage/LetterCard'
import { LetterData } from '@/types/Letter'

// 예시 데이터 (실제로는 props로 받거나 API에서 가져올 것입니다)
const mockLetters: LetterData[] = [
  {
    'type': 'letter',
    'color': 'autumn',
    'name': '아빠',
    'state': '안읽음',
    'date': '2025.01.17'
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
    'date': '2025.01.15'
  },
]

function ReceivedLetterContent() {
  
  const letters = mockLetters

  const handleLetterClick = (letter: LetterData) => {
    console.log('편지 클릭:', letter)
    // 나중에 상세 페이지로 이동하거나 모달을 띄우는 로직 추가
  }

  // 편지가 없는 경우 표시할 내용
  if (!letters || letters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">아직 받은 편지가 없습니다.</p>
      </div>
    )
  }

  // 편지가 있는 경우 표시할 내용
  return (
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
  )
}

export default ReceivedLetterContent