import { useEffect } from "react" 
import { useNavigate } from "react-router-dom" 
import useUser from '@/hooks/useUser';
import { requestNotificationPermission } from '@/hooks/firebase.ts';
import apiClient from '@/apis/apiClient.ts';
import useUserStore from '@/stores/useUserStore';

function OAuthCallback() {
  const navigate = useNavigate() 
  const { checkAuthAndFetchUserData } = useUser();

  useEffect(() => {
    const handleAuthentication = async () => {
      // URL에서 토큰 정보 가져오기
                const urlParams = new URLSearchParams(window.location.search) 
                const accessToken = urlParams.get("accessToken") 
                const refreshToken = urlParams.get("refreshToken") 

      // 토큰이 존재하면 localStorage에 저장
      if (accessToken) {
                    localStorage.setItem("accessToken", accessToken) 
                    console.log("Access 토큰 저장 완료") 
      }
      if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken) 
                    console.log("Refresh 토큰 저장 완료") 
      }

      // 사용자 정보 조회 및 상태 업데이트
      await checkAuthAndFetchUserData();

      // FCM 토큰 요청 및 서버 전송
      const fcmToken = await requestNotificationPermission();

      if (fcmToken) {
        // 백엔드에 토큰 전송
        await apiClient.post('/api/fcm', {
          token: fcmToken
        })
        console.log('FCM 토큰 서버 전송 완료');
      }

      // 메인 페이지로 이동 (ProtectedRoute가 조건에 따라 적절히 리다이렉트 처리)
      const role = useUserStore.getState().user.role;
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate("/");
      }
    }
    handleAuthentication();
  }, [navigate, checkAuthAndFetchUserData]);

  // 로딩 화면 대신 빈 컴포넌트 반환 (App 컴포넌트에서 로딩 처리함)
  return null;
}

export default OAuthCallback 
