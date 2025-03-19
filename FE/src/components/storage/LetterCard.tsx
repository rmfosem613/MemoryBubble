import React from 'react'
import { LetterData } from '@/types/Letter'
import { getLetterImage } from '@/utils/letterUtils'

interface LetterCardProps {
  letter: LetterData
  onClick?: (letter: LetterData) => void
}

function LetterCard({ letter, onClick }: LetterCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(letter)
    }
  }

  return (
    <div 
      className="bg-white rounded-[8px] shadow-sm overflow-hidden flex w-full h-[120px] cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={getLetterImage(letter)}
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
  )
}

export default LetterCard