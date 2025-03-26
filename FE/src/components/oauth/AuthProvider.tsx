import { useEffect, useState } from "react" 
import { useNavigate, useLocation } from "react-router-dom" 
import apiClient from "@/apis/apiClient" 
import { useUserStore } from "@/stores/useUserStroe" 

interface AuthProviderProps {
  children: React.ReactNode 
}

// 인증이 필요하지 않은 공개 경로 목록
const publicRoutes = ["/login", "/oauth/callback", "/kakao"] 

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true) 
  const navigate = useNavigate() 
  const location = useLocation() 
  const { user, setUser } = useUserStore() 

  useEffect(() => {
    const checkAuth = async () => {
      // 현재 경로가 공개 경로 중 하나라면 인증 확인을 건너뜀
      if (publicRoutes.some(route => location.pathname.startsWith(route))) {
        setIsLoading(false) 
        return 
      }

      try {
        const accessToken = localStorage.getItem("accessToken") 
        
        // 토큰이 없으면 로그인 페이지로 이동
        if (!accessToken) {
          navigate("/login") 
          setIsLoading(false) 
          return 
        }

        // 이미 사용자 데이터가 있는 경우, 리다이렉트 처리 후 종료
        if (user) {
          handleRedirectBasedOnUserData(user) 
          setIsLoading(false) 
          return 
        }

        // 사용자 데이터가 없으면 서버에서 가져옴
        const userResponse = await apiClient.get("/api/users/me") 
        const { userId, familyId } = userResponse.data 

        // 상세 사용자 정보 가져오기
        const userDetailsResponse = await apiClient.get(`/api/users/${userId}`) 
        const userDetails = userDetailsResponse.data 
        
        // 전역 상태에 사용자 정보 저장
        const userData = {
          userId,
          familyId,
          ...userDetails
        } 
        
        setUser(userData) 
        
        // 사용자 데이터에 따라 적절한 페이지로 리다이렉트
        handleRedirectBasedOnUserData(userData) 
      } catch (error) {
        console.error("인증 확인 중 오류 발생:", error) 
        // 오류 발생 시 토큰 삭제 후 로그인 페이지로 이동
        localStorage.removeItem("accessToken") 
        localStorage.removeItem("refreshToken") 
        navigate("/kakao") 
      } finally {
        setIsLoading(false) 
      }
    } 

    checkAuth() 
  }, [location.pathname, navigate, setUser, user]) 

  // 사용자 데이터에 따라 페이지 리다이렉트 처리
  const handleRedirectBasedOnUserData = (userData: any) => {
    const { familyId, birth } = userData 
    
    // 현재 페이지가 적절한 경우 리다이렉트를 하지 않음
    if (
      (!familyId && location.pathname === "/enter") ||
      (!birth && location.pathname === "/join") ||
      (familyId && birth && location.pathname === "/")
    ) {
      return 
    }

    // 사용자 데이터에 따라 적절한 페이지로 이동
    if (!familyId && location.pathname !== "/enter") {
      navigate("/enter")  // 가족 정보 입력 페이지로 이동
    } else if (!birth && location.pathname !== "/join") {
      navigate("/join")  // 추가 회원 가입 페이지로 이동
    } else if (location.pathname === "/kakao") {
      navigate("/")  // 로그인 후 메인 페이지로 이동
    }
  } 

  // 로딩 중이면 화면에 "로딩 중..." 표시
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div> 
  }

  return <>{children}</> 
}

export default AuthProvider 
