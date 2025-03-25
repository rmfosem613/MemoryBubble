package com.ssafy.memorybubble.common.util;

import com.ssafy.memorybubble.api.album.exception.AlbumException;
import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.User;
import lombok.extern.slf4j.Slf4j;

import static com.ssafy.memorybubble.common.exception.ErrorCode.ALBUM_ACCESS_DENIED;

@Slf4j
public class Validator {
    public static void validateAlbumAccess(User user, Album album) {
        if (!album.getFamily().getId().equals(user.getFamily().getId())) {
            log.info("album.getFamily().getId() = {}", album.getFamily().getId());
            log.info("user.getFamily().getId() = {}", user.getFamily().getId());
            throw new AlbumException(ALBUM_ACCESS_DENIED);
        }
    }
}