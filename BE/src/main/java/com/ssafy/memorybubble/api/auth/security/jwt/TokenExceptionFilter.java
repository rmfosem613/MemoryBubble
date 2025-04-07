package com.ssafy.memorybubble.api.auth.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.memorybubble.api.auth.exception.TokenException;
import com.ssafy.memorybubble.common.exception.ErrorCode;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (TokenException e) {
            log.error(e.getMessage());
            // 상태 코드 설정
            response.setStatus(e.getErrorCode().getHttpStatus().value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // 응답 본문 작성 -> ErrorResponse 추가 시 수정
            ErrorCode errorCode = e.getErrorCode();

            ErrorResponse errorResponse = ErrorResponse.builder()
                    .errorCode(errorCode)
                    .message(errorCode.getMessage())
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        }
    }
}