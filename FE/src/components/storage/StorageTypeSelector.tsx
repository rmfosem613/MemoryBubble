import { useBoxStore } from '@/stores/useLetterStore';

function StorageTypeSelector() {
  const { storageType } = useBoxStore();

  const setStorageType = (type) => useBoxStore.setState({ storageType: type });

  return (
    <div className="border-2 border-gray-300 h-[54px] rounded-[8px] grid grid-cols-2 w-[300px]">
      <div className="flex p-1" onClick={() => setStorageType('new')}>
        <div className={`${storageType === 'new' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded-[8px] h-full w-full flex items-center justify-center transition-colors duration-200 cursor-pointer`}>
          <p className={`${storageType === 'new' ? 'text-lg-lg text-white' : 'text-subtitle-1-lg font-p-500 text-gray-600'}`}>새 편지</p>
        </div>
      </div>
      <div className="flex p-1" onClick={() => setStorageType('received')}>
        <div className={`${storageType === 'received' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} rounded-[8px] h-full w-full flex items-center justify-center transition-colors duration-200 cursor-pointer`}>
          <p className={`${storageType === 'received' ? 'text-lg-lg text-white' : 'text-subtitle-1-lg font-p-500 text-gray-600'}`}>받은 편지</p>
        </div>
      </div>
    </div>
  )
}

export default StorageTypeSelector