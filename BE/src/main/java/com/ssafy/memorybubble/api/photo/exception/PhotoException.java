package com.ssafy.memorybubble.api.photo.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class PhotoException extends CustomException {
    public PhotoException(ErrorCode errorCode) { super(errorCode); }
}
