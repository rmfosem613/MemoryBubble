package com.ssafy.memorybubble.api.album.exception;

import com.ssafy.memorybubble.common.exception.CustomException;
import com.ssafy.memorybubble.common.exception.ErrorCode;

public class AlbumException extends CustomException {
    public AlbumException(ErrorCode errorCode) { super(errorCode); }
}