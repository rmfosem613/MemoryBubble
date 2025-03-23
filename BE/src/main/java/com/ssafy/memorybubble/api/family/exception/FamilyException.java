package com.ssafy.memorybubble.api.family.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class FamilyException extends CustomException {
    public FamilyException(ErrorCode errorCode) {
        super(errorCode);
    }
}