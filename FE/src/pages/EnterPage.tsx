import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserApi from '@/apis/useUserApi'
import useUserStore from '@/stores/useUserStore'
import Button from "@/components/common/Button/Button"
import Alert from '@/components/common/Alert'

function EnterPage() {
  const [inviteCode, setInviteCode] = useState('')

  const navigate = useNavigate()
  const { verifyFamilyCode } = useUserApi()
  const { setUser } = useUserStore()

  // 알림 관련 상태
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("red");

  // 알림 메시지 표시
  const showAlertMessage = (message: string, color: string = "red") => {
    setAlertMessage(message);
    setAlertColor(color);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3500);
  };

  // 그룹 가입하기 버튼 클릭 처리 및 페이지 이동
  const handleJoinClick = async () => {
    if (!inviteCode.trim()) {
      showAlertMessage("초대코드를 입력해주세요.", "red");
      return;
    }

    // 중간에 공백이 있는지 검사
    if (inviteCode.includes(' ')) {
      showAlertMessage("유효하지 않은 초대코드입니다.", "red");
      return;
    }

    try {
      const response = await verifyFamilyCode({ code: inviteCode.trim() })
      if (response.status === 200) {
        // 응답 데이터 저장
        setUser(response.data)
        // join 페이지로 이동
        navigate('/join')
      }
    } catch (error: any) {
      console.error('초대 코드 검증 실패:', error)
      showAlertMessage("유효하지 않은 초대코드입니다.", "red");
    }
  }

  const handleGroupCreateClick = () => {
    navigate('/create')
  }

  return (
    <>
      {showAlert && <Alert message={alertMessage} color={alertColor} />}

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
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
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

    </>
  )
}

export default EnterPage