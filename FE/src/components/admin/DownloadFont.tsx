import { Download, FileType2 } from "lucide-react";

interface FontProps {
  user: string
}

const DownloadFont = ({ user }: FontProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex w-[150px] flex-col items-center justify-center border h-[150px] rounded-[8px] shadow-sm p-2">
        <FileType2 width={'80px'} height={'80px'} strokeWidth="1" />
        <div className="flex items-center mt-2">
          <span className="font-p-700">{user}</span>
          <span>님의 폰트</span>
        </div>
        <Download className="mt-1" />
      </div>
    </div>
  )
}

export default DownloadFont