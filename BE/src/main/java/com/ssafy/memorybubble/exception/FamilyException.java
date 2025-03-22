package com.ssafy.memorybubble.exception;

public class FamilyException extends CustomException {
    public FamilyException(ErrorCode errorCode) {
        super(errorCode);
    }
}