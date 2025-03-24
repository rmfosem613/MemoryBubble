import Alert from '@/components/admin/AlertAdmin'
import DownloadFont from '@/components/admin/DownloadFont'

function AdminPage() {
  return (
    <div className='container pt-[68px] space-y-3'>
      <div className='flex py-[10px] border border-x-0 border-t-0 border-gray-700 botder-b-4 space-x-1 items-end'>
        <span className='font-p-700 text-h5-lg'>김싸피</span>
        <span className='font-p-500 text-subtitle-1-lg flex mb-[1.3px]'>관리자님</span>
      </div>
      <div className='font-p-500 text-subtitle-1-lg'>폰트 생성 의뢰 목록</div>
      <div className='flex-row space-y-3 border bg-gray-200 h-[300px] w-full items-start p-4 overflow-y-auto'>
        <Alert user='김싸피' />
        <Alert user='김싸피' />
        <Alert user='김싸피' />
        <Alert user='김싸피' />
        <Alert user='김싸피' />
        <Alert user='김싸피' />
      </div>
      <div className='font-p-500 text-subtitle-1-lg'>다운로드 목록</div>
      <div className='flex items-center space-x-3 border border-gray-500 h-[200px] w-full p-4 overflow-x-auto'>
        <DownloadFont user='김싸피' />
        <DownloadFont user='김싸피' />
        <DownloadFont user='김싸피' />
        <DownloadFont user='김싸피' />
        <DownloadFont user='김싸피' />
        <DownloadFont user='김싸피' />
      </div>
    </div>
  )
}

export default AdminPage