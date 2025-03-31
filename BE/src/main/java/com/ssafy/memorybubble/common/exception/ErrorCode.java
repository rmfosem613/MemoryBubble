package com.ssafy.memorybubble.common.exception;

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

    ACCESS_DENIED(FORBIDDEN, "접근 권한이 없습니다."),
    UNAUTHORIZED_USER(UNAUTHORIZED, "인증되지 않은 사용자 입니다."),

    // family
    ALREADY_FAMILY_EXIST(BAD_REQUEST, "이미 다른 가족에 가입되어 있습니다."),
    FAMILY_NOT_FOUND(FORBIDDEN, "해당 가족에 가입되어 있지 않습니다."),
    INVITE_CODE_NOT_FOUND(BAD_REQUEST, "유효하지 않은 코드입니다."),
    ALREADY_JOINED(BAD_REQUEST, "이미 가족 정보가 등록되어 있습니다."),

    // user
    USER_NOT_FOUND(NOT_FOUND, "사용자를 찾을 수 없습니다."),
    USER_ACCESS_DENIED(FORBIDDEN, "다른 사용자의 프로필은 접근할 수 없습니다."),

    // album
    ALBUM_NOT_FOUND(NOT_FOUND, "앨범을 찾을 수 없습니다."),
    ALBUM_ACCESS_DENIED(FORBIDDEN, "해당 앨범에 접근할 수 없습니다."),

    // schedule
    SCHEDULE_DATE_INVALID(BAD_REQUEST, "잘못된 날짜입니다."),
    SCHEDULE_NOT_FOUND(NOT_FOUND, "일정을 찾을 수 없습니다."),

    // letter
    LETTER_RECEIVER_FORBIDDEN(FORBIDDEN, "가족이 아닌 사용자에게는 편지를 보낼 수 없습니다."),
    LETTER_NOT_FOUND(NOT_FOUND, "편지를 찾을 수 없습니다."),
    LETTER_ACCESS_DENIED(FORBIDDEN, "해당 편지를 열람할 수 없습니다."),
    LETTER_OPEN_DENIED(FORBIDDEN, "아직 열람할 수 없는 편지입니다."),

    // photo
    PHOTO_NOT_FOUND(NOT_FOUND, "사진을 찾을 수 없습니다."),
    PHOTO_ALBUM_INVALID(BAD_REQUEST, "앨범에 포함되지 않은 사진입니다."),

    // font
    FONT_NOT_FOUND(NOT_FOUND, "폰트를 찾을 수 없습니다"),
    FONT_BAD_REQUEST(BAD_REQUEST, "이미 생성된 폰트가 있습니다."),
    FONT_ACCESS_DENIED(FORBIDDEN, "다른 사용자의 폰트를 삭제할 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
