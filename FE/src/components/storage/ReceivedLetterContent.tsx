import cassetteSpring from '@/assets/letter/cassetteSpring.svg'
import cassetteSummer from '@/assets/letter/cassetteSummer.svg'
import cassetteAutumn from '@/assets/letter/cassetteAutumn.svg'
import cassetteWinter from '@/assets/letter/cassetteWinter.svg'

import letterSpring from '@/assets/letter/LetterSpring.svg'
import letterSummer from '@/assets/letter/LetterSummer.svg'
import letterAutumn from '@/assets/letter/LetterAutumn.svg'
import letterWinter from '@/assets/letter/LetterWinter.svg'

import unLetterSpring from '@/assets/letter/unLetterSpring.svg'
import unLetterSummer from '@/assets/letter/unLetterSummer.svg'
import unLetterAutumn from '@/assets/letter/unLetterAutumn.svg'
import unLetterWinter from '@/assets/letter/unLetterWinter.svg'

// 편지 데이터 타입 정의
interface LetterData {
  type: 'letter' | 'cassette'
  color: 'spring' | 'summer' | 'autumn' | 'winter'
  name: string
  state: '읽음' | '안읽음'
  date: string
}

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
  // 실제 구현에서는 props나 상태 관리 라이브러리를 통해 데이터를 받아옵니다
  const letters = mockLetters

  // 이미지 선택 함수
  const getImage = (letter: LetterData) => {
    const { type, color, state } = letter

    if (type === 'cassette') {
      switch (color) {
        case 'spring': return cassetteSpring
        case 'summer': return cassetteSummer
        case 'autumn': return cassetteAutumn
        case 'winter': return cassetteWinter
        default: return cassetteWinter
      }
    } else {
      // letter 타입인 경우
      if (state === '안읽음') {
        switch (color) {
          case 'spring': return unLetterSpring
          case 'summer': return unLetterSummer
          case 'autumn': return unLetterAutumn
          case 'winter': return unLetterWinter
          default: return unLetterWinter
        }
      } else {
        switch (color) {
          case 'spring': return letterSpring
          case 'summer': return letterSummer
          case 'autumn': return letterAutumn
          case 'winter': return letterWinter
          default: return letterWinter
        }
      }
    }
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
          <div key={index} className="bg-white rounded-[8px] shadow-sm overflow-hidden flex w-full h-[120px]">
            <div className="relative">
              <img
                src={getImage(letter)}
                alt={`${letter.name}의 ${letter.type}`}
                className="h-full object-right object-cover"
              />
            </div>
            <div className="flex-row justify-between h-full p-3 border-t w-[130px]">
              <p className="font-p-500 text-subtitle-1-lg text-gray-800">{letter.name}</p>
              <div className="flex-row justify-between mt-[30px]">
                <p className="font-p-400 text-p-lg text-gray-500">{letter.state}</p>
                <p className="font-p-400 text-p-lg">{letter.date}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceivedLetterContent