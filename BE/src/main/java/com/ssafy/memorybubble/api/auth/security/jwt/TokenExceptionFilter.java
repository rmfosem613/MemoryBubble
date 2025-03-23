package com.ssafy.memorybubble.api.auth.security.jwt;

import com.ssafy.memorybubble.api.auth.exception.TokenException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class TokenExceptionFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (TokenException e) {
            log.error(e.getMessage());
            // 상태 코드 설정
            response.setStatus(e.getErrorCode().getHttpStatus().value());

            // 응답 헤더 설정 (선택 사항)
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // 응답 본문 작성 -> ErrorResponse 추가 시 수정
            String errorResponse = "{ \"error\": \"" + e.getMessage() + "\" }";
            response.getWriter().write(errorResponse);
        }
    }
}