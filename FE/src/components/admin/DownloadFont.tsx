import { Download, FileType2 } from "lucide-react";

interface FontProps {
  user: string,
  count: number
}

const DownloadFont = ({ user, count }: FontProps) => {
  return (
    <div className="flex border h-[70px] w-[150px] justify-center items-center space-x-2 shadow-sm">
      <FileType2 width={'40px'} height={'40px'} strokeWidth="1" />
      <div className="">
        <span className="font-p-700">{user}</span>
        <span>-{count}</span>
      </div>
      <Download className="mt-1" />
    </div>
  )
}

export default DownloadFont