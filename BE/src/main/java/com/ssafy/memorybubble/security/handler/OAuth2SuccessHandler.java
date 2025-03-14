package com.ssafy.memorybubble.security.handler;

import com.ssafy.memorybubble.security.dto.PrincipalDetails;
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

    private static final String URI = "/api/auth/success";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        // 토큰 전달을 위한 redirect URI -> test용 queryParam, access token으로 수정 필요
        String redirectUrl = UriComponentsBuilder.fromUriString(URI)
                .queryParam("userId", principalDetails.getUsername())
                .build().toUriString();

        log.info("OAuth2 인증 성공 - 리디렉트 URL: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}
