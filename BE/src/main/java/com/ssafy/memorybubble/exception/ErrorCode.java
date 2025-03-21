package com.ssafy.memorybubble.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // auth
    TOKEN_EXPIRED(UNAUTHORIZED, "토큰이 만료되었습니다."),
    INVALID_TOKEN(UNAUTHORIZED, "올바르지 않은 토큰입니다."),
    INVALID_JWT_SIGNATURE(UNAUTHORIZED, "잘못된 JWT 시그니처입니다."),

    // family
    ALREADY_FAMILY_EXIST(BAD_REQUEST, "이미 다른 가족에 가입되어 있습니다."),
    FAMILY_NOT_FOUND(FORBIDDEN, "해당 가족에 가입되어 있지 않습니다."),
    INVITE_CODE_NOT_FOUND(BAD_REQUEST, "유효하지 않은 코드입니다."),
    ALREADY_JOINED(BAD_REQUEST, "이미 가족 정보가 등록되어 있습니다."),

    // user
    USER_NOT_FOUND(NOT_FOUND, "사용자를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
