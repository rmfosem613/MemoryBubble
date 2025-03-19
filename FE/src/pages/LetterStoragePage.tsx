import { useNavigate } from 'react-router-dom'
import Title from '@/components/common/Title'
import LetterTypeSelector from '@/components/storage/StorageTypeSelector'
import Button from '@/components/common/Button/Button'
import { useBoxStore } from '@/stores/useLetterStore'

import postBox from '@/assets/storage/postBox.svg'
import doll from '@/assets/storage/doll.svg'

function LetterStoragePage() {
  const navigate = useNavigate()
  const { storageType } = useBoxStore()

  const handleButtonClick = () => {
    navigate('/letter')
  }

  // 새 편지 컨텐츠
  const NewLetterContent = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-2xl font-bold text-gray-700 mb-4">새 편지함</div>
      <p className="text-gray-500">아직 새로운 편지가 없습니다.</p>
    </div>
  )

  // 받은 편지 컨텐츠
  const ReceivedLetterContent = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-2xl font-bold text-gray-700 mb-4">받은 편지함</div>
      <p className="text-gray-500">아직 받은 편지가 없습니다.</p>
    </div>
  )

  return (
    <>
      <div className="container mt-[17px]">
        <Title text="편지보관함" />

        <div className='mt-[12px] flex justify-between'>
          <LetterTypeSelector />
          <div className='w-[200px]'>
            <Button
              icon='send'
              name='편지보내기'
              color='blue'
              onClick={handleButtonClick}
            />
          </div>
        </div>

        <div className='border-2 border-gray-300 h-[490px] rounded-[8px] mt-[3px]'>
          {storageType === 'new' ? <NewLetterContent /> : <ReceivedLetterContent />}
        </div>

      </div>

      <img src={postBox} className='absolute bottom-0 ml-[110px] w-[120px]'/>
      <img src={doll} className='absolute bottom-0 mr-[130px] right-0'/>
    </>
  )
}

export default LetterStoragePage