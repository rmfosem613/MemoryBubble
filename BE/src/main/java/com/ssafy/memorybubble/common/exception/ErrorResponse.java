package com.ssafy.memorybubble.common.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    ErrorCode errorCode;
    String message;
}