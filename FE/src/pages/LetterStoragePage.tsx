import { useNavigate } from 'react-router-dom'
import Title from '@/components/common/Title'
import LetterTypeSelector from '@/components/storage/StorageTypeSelector'
import Button from '@/components/common/Button/Button'
import { useBoxStore } from '@/stores/useLetterStore'

import NewLetterContent from '@/components/storage/NewLetterContent'
import ReceivedLetterContent from '@/components/storage/ReceivedLetterContent'

import postBox from '@/assets/storage/postBox.svg'
import doll from '@/assets/storage/doll.svg'

import '@/components/storage/letterAnimation.css';

function LetterStoragePage() {
  const navigate = useNavigate()
  const { storageType } = useBoxStore()

  const handleButtonClick = () => {
    navigate('/letter')
  }

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