import Alert from '@/components/admin/AlertAdmin'
import DownloadFont from '@/components/admin/DownloadFont'

function AdminPage() {
  return (
    <div className='container pt-[68px] space-y-3'>
      {/* Header section */}
      <div className='flex py-[10px] border border-x-0 border-t-0 border-gray-700 space-x-1 items-end'>
        <span className='font-p-700 text-h5-lg'>김싸피</span>
        <span className='font-p-500 text-subtitle-1-lg flex mb-[1.3px]'>관리자님</span>
      </div>

      {/* Alert section */}
      <div className='font-p-500 text-subtitle-1-lg'>폰트 생성 의뢰 목록</div>
      <div className='flex flex-col space-y-3 border bg-gray-200 h-[300px] w-full p-4 overflow-y-auto'>
        <Alert user='김싸피' font='싸피체' />
        <Alert user='김싸피' font='싸피체' />
        <Alert user='김싸피' font='싸피체' />
        <Alert user='김싸피' font='싸피체' />
        <Alert user='김싸피' font='싸피체' />
        <Alert user='김싸피' font='싸피체' />
      </div>

      {/* Font template section */}
      <div className='font-p-500 text-subtitle-1-lg'>폰트 템플릿</div>
      <div className='grid grid-cols-12 border border-gray-500 h-[200px]'>
        {/* Left section - PNG files */}
        <div className='col-span-8 flex flex-col'>
          <p className='font-p-700 text-center'>사용자가 작성한 폰트 png</p>
          <div className='grid grid-cols-3 md:grid-cols-4 gap-3 p-2 h-full overflow-y-auto'>
            <DownloadFont user='김싸피' count={1} />
            <DownloadFont user='김싸피' count={2} />
            <DownloadFont user='김싸피' count={3} />
            <DownloadFont user='김싸피' count={4} />
            <DownloadFont user='김싸피' count={5} />
            <DownloadFont user='김싸피' count={6} />
            <DownloadFont user='김싸피' count={7} />
            <DownloadFont user='김싸피' count={8} />
          </div>
        </div>

        {/* Right section - TTF upload */}
        <div className='col-span-4 flex flex-col'>
          <p className='font-p-700 text-center'>S3, DB에 .ttf 파일 저장</p>
          <div className='flex items-center justify-center p-4 h-full'>
            <div className='border border-gray-500 w-full h-full bg-gray-100 rounded-[8px] border-dashed flex items-center justify-center'>
              ttf 파일 넣기
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage