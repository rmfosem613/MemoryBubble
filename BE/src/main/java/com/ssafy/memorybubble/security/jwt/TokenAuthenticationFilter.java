package com.ssafy.memorybubble.security.jwt;

import com.ssafy.memorybubble.exception.TokenException;
import com.ssafy.memorybubble.service.BlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static com.ssafy.memorybubble.exception.ErrorCode.TOKEN_EXPIRED;

@RequiredArgsConstructor
@Component
@Slf4j
public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final BlacklistService blacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String accessToken = resolveToken(request);
        log.info("Access token: {}", accessToken);

        // accessToken 검증
        if (StringUtils.hasText(accessToken)) {
            if (tokenProvider.validateToken(accessToken) && !blacklistService.isBlacklisted(accessToken)) {
                log.info("Access token validated");
                // 토큰이 유효할 경우, Authentication 객체를 가지고 와서 Security Context에 저장
                Authentication authentication = tokenProvider.getAuthentication(accessToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                log.info("Access token expired");
                throw new TokenException(TOKEN_EXPIRED);
            }
        }

        filterChain.doFilter(request, response);
    }

    // Authorization Bearer을 제외한 token만 추출
    private String resolveToken(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION);
        if (!StringUtils.hasText(token) || !token.startsWith("Bearer ")) {
            return null;
        }
        return token.substring("Bearer ".length());
    }
}