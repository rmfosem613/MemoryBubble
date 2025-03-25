import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "@/apis/apiClient";

function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken")

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            console.log("토큰 저장 완료:", accessToken);
        }
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
            console.log("토큰 저장 완료:", refreshToken);
        }

        // 로그인 후 홈 화면으로 이동
        navigate("/enter");
    }, []);

    return <div>로그인 중...</div>;
}

export default OAuthCallback;