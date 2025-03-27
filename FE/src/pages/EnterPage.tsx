import { useNavigate } from 'react-router-dom'

import Button from "@/components/common/Button/Button"

function EnterPage() {

  const navigate = useNavigate()

  // 그룹 가입하기 페이지 이동
  const handleJoinClick = () => {
    navigate('/join')
  }

  const handleGroupCreateClick = () => {
    navigate('/create')
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-[550px] px-4 py-8">
        <h1 className="text-h2-lg font-p-700 mb-2">추억방울 만들기</h1>
        <p className="font-p-500 text-subtitle-1-lg text-gray-500 mb-8">소중한 추억을 간직하는 공간 추억방울</p>

        <div className="w-full text-left mb-4">
          <label className="block text-subtitle-1-lg font-p-500 mb-2">초대코드</label>
          <input
            type="text"
            placeholder="초대코드를 입력해 주세요"
            className="w-full placeholder-gray-500 h-14 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="w-full mb-6">
          <Button name="그룹 가입하기" color="blue" onClick={handleJoinClick} />
        </div>

        <div className="flex items-center justify-center gap-2">
          <p className="text-gray-600">아직 그룹이 없으신가요?</p>
          <p className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={handleGroupCreateClick}>그룹을 생성해보세요!</p>
        </div>
      </div>
    </div>
  )
}

export default EnterPage