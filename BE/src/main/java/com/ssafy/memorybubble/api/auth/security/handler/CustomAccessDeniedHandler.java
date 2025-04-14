package com.ssafy.memorybubble.api.auth.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.memorybubble.common.exception.ErrorCode;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

@Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        log.error("AccessDeniedException is occurred. ", accessDeniedException);

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // ErrorResponse 객체 생성
        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;

        ErrorResponse errorResponse = ErrorResponse.builder()
                .errorCode(errorCode)
                .message(errorCode.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}