package com.ssafy.memorybubble.api.letter.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class LetterException extends CustomException {
    public LetterException(ErrorCode errorCode) { super(errorCode); }
}
