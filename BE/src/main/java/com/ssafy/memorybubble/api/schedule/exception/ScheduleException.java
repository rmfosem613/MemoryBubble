package com.ssafy.memorybubble.api.schedule.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class ScheduleException extends CustomException {
    public ScheduleException(ErrorCode errorCode) { super(errorCode); }
}
