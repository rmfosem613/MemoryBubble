package com.ssafy.memorybubble.api.auth.security.handler;

import com.ssafy.memorybubble.api.auth.dto.TokenDto;
import com.ssafy.memorybubble.api.auth.security.jwt.TokenProvider;
import com.ssafy.memorybubble.api.auth.service.TokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;
    private final TokenService tokenService;
    // 클라이언트에서 임의의 callback 페이지 만들어서 accessToken, refreshToken 저장
    //private static final String URI = "http://localhost:5173/oauth/callback"; // "/api/auth/success";
    private static final String URI = "/";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Authentication에 OAuth2User(인증된 사용자 정보) 객체가 담김
        TokenDto tokenDto = tokenProvider.getTokenDto(authentication);
        String accessToken = tokenDto.getAccessToken();
        log.info("Access token: {}", accessToken);
        String refreshToken = tokenDto.getRefreshToken();
        log.info("Refresh token: {}", refreshToken);
        tokenService.saveRefreshToken(authentication.getName(), accessToken, refreshToken);
        log.info("Saved token");

        // 토큰 전달을 위한 redirect URI -> 추후 클라이언트로 redirect
        String redirectUrl = UriComponentsBuilder.fromUriString(URI)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
