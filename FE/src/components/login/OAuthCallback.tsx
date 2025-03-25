import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "@/stores/useUserStroe";

function OAuthCallback() {
    const navigate = useNavigate();
    const { setUser, setFamilyInfo } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                // Get tokens from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const accessToken = urlParams.get("accessToken");
                const refreshToken = urlParams.get("refreshToken");

                if (!accessToken || !refreshToken) {
                    console.error("토큰이 없습니다.");
                    navigate("/login");
                    return;
                }

                // Store tokens in localStorage
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // Set authorization header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Fetch user data from API
                try {
                    const userResponse = await axios.get("https://memorybubble.site/api/users/me");
                    
                    if (userResponse.data) {
                        // Save user data to store
                        setUser(userResponse.data);
                        
                        // Check if user has a family group
                        if (userResponse.data.familyId) {
                            // Fetch family info if available
                            try {
                                const familyResponse = await axios.get(`https://memorybubble.site/api/families/${userResponse.data.familyId}`);
                                if (familyResponse.data) {
                                    setFamilyInfo(familyResponse.data);
                                }
                                // Navigate to main page if user has a family
                                navigate("/");
                            } catch (familyError) {
                                console.error("가족 정보를 불러오는데 실패했습니다:", familyError);
                                navigate("/");
                            }
                        } else {
                            // Navigate to enter page if user doesn't have a family
                            navigate("/enter");
                        }
                    }
                } catch (userError) {
                    console.error("사용자 정보를 불러오는데 실패했습니다:", userError);
                    // Fallback to enter page if can't determine user status
                    navigate("/enter");
                }
            } catch (error) {
                console.error("로그인 처리 중 오류가 발생했습니다:", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        handleAuth();
    }, [navigate, setUser, setFamilyInfo]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            {isLoading && (
                <div className="text-center">
                    <div className="mb-4">로그인 처리 중...</div>
                    <div className="w-12 h-12 border-4 border-t-p-800 border-gray-200 rounded-full animate-spin mx-auto"></div>
                </div>
            )}
        </div>
    );
}

export default OAuthCallback;