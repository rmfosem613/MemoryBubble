package com.ssafy.memorybubble.api.auth.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.memorybubble.common.exception.ErrorCode;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        log.error("AuthenticationException is occurred. ", authException);
        log.error("Request Uri : {}", request.getRequestURI());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // ErrorResponse 객체 생성
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED_USER;

        ErrorResponse errorResponse = ErrorResponse.builder()
                .errorCode(errorCode)
                .message(errorCode.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
