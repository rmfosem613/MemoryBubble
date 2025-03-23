package com.ssafy.memorybubble.api.user.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class UserException extends CustomException {
    public UserException(ErrorCode errorCode) {
        super(errorCode);
    }
}