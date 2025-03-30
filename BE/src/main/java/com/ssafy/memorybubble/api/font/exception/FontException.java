package com.ssafy.memorybubble.api.font.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class FontException extends CustomException {

    public FontException(ErrorCode errorCode) {
        super(errorCode);
    }
}
