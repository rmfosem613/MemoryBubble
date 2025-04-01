import { useLetterStore } from '@/stores/useLetterStore';

function LetterTypeSelector() {
  const { letterType, setLetterType } = useLetterStore();

  return (
    <div className="border-2 border-gray-300 h-[46px] rounded-[8px] grid grid-cols-2">
      <div className="flex p-1" onClick={() => setLetterType('TEXT')}>
        <div
          className={`${letterType === 'TEXT' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded-[8px] h-full w-full flex items-center justify-center transition-colors duration-200 cursor-pointer`}>
          <p
            className={`${letterType === 'TEXT' ? 'text-lg-lg text-white' : 'text-subtitle-1-lg font-p-500 text-gray-600'}`}>
            텍스트 편지
          </p>
        </div>
      </div>
      <div className="flex p-1" onClick={() => setLetterType('AUDIO')}>
        <div
          className={`${letterType === 'AUDIO' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded-[8px] h-full w-full flex items-center justify-center transition-colors duration-200 cursor-pointer`}>
          <p
            className={`${letterType === 'AUDIO' ? 'text-lg-lg text-white' : 'text-subtitle-1-lg font-p-500 text-gray-600'}`}>
            카세트 편지
          </p>
        </div>
      </div>
    </div>
  );
}

export default LetterTypeSelector;
