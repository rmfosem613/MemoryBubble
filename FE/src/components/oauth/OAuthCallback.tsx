import { useEffect, useState } from "react" 
import { useNavigate } from "react-router-dom" 
import apiClient from "@/apis/apiClient" 
import { useUserStore } from "@/stores/useUserStroe" 

function OAuthCallback() {
    const navigate = useNavigate() 
    const [isLoading, setIsLoading] = useState(true) 
    const { setUser } = useUserStore() 

    useEffect(() => {
        const handleAuthentication = async () => {
            try {
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

                // 사용자 정보 가져오기
                const userResponse = await apiClient.get("/api/users/me") 
                const { userId, familyId } = userResponse.data 

                // 상세 사용자 정보 가져오기
                const userDetailsResponse = await apiClient.get(`/api/users/${userId}`) 
                const userDetails = userDetailsResponse.data 
                
                // 전역 상태에 사용자 정보 저장
                setUser({
                    userId,
                    familyId,
                    ...userDetails
                }) 

                // 사용자 정보에 따라 페이지 이동 처리
                if (!familyId) {
                    navigate("/enter")  // 가족 정보 입력 페이지로 이동
                } else if (!userDetails.birth) {
                    navigate("/join")  // 추가 회원 가입 페이지로 이동
                } else {
                    navigate("/")  // 메인 페이지로 이동
                }
            } catch (error) {
                console.error("인증 처리 중 오류 발생:", error) 
                navigate("/login")  // 오류 발생 시 로그인 페이지로 이동
            } finally {
                setIsLoading(false) 
            }
        } 

        handleAuthentication() 
    }, [navigate, setUser]) 

    return <div className="flex items-center justify-center min-h-screen">로그인 처리 중...</div> 
}

export default OAuthCallback 
