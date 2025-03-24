import { AlertCircle, CircleCheck } from "lucide-react";

interface FontProps {
  user: string
}

const AlertAdmin = ({ user }: FontProps) => {
  return (
    <>
      <div className={`p-4 flex items-center justify-between border border-gray-700 rounded-lg bg-white w-[500px] h-[60px]`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className={`w-4 h-4 text-gray-700`} />
          <span className={`font-medium text-sm text-gray-700`}><span className="font-p-800 text-blue-700">{user}</span>님이 폰트 생성을 의뢰하셨습니다.</span>
        </div>
        {/* x 누르면 완료 처리 */}
        <CircleCheck className={`w-6 h-6 text-green-200`} />
      </div>
    </>
  )
}

export default AlertAdmin