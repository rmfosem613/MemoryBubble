package com.ssafy.memorybubble.common.util;

import com.ssafy.memorybubble.api.album.exception.AlbumException;
import com.ssafy.memorybubble.api.family.exception.FamilyException;
import com.ssafy.memorybubble.api.font.exception.FontException;
import com.ssafy.memorybubble.api.letter.exception.LetterException;
import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.Font;
import com.ssafy.memorybubble.domain.User;
import lombok.extern.slf4j.Slf4j;

import static com.ssafy.memorybubble.common.exception.ErrorCode.*;

@Slf4j
public class Validator {
    public static void validateAlbumAccess(Family family, Album album) {
        if (!family.getId().equals(album.getFamily().getId())) {
            throw new AlbumException(ALBUM_ACCESS_DENIED);
        }
    }

    public static void validateAlbumAccess(User user, Album album) {
        validateAlbumAccess(user.getFamily(), album);
    }

    public static void validateFontOwnership(User user, Font font) {
        if (!user.getId().equals(font.getUser().getId())) {
            log.info("user.getId()={}", user.getId());
            log.info("font.getUser().getId()={}", font.getUser().getId());
            throw new FontException(FONT_ACCESS_DENIED);
        }
    }

    public static Family validateAndGetFamily(User user) {
        Family family = user.getFamily();
        if(family == null) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }
        return family;
    }

    public static Family validateAndGetFamily(User user, Long requestedFamilyId) {
        Family family = validateAndGetFamily(user);
        if(!requestedFamilyId.equals(family.getId())) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }
        return family;
    }

    public static void validateFamilyRelationship(User sender, User receiver) {
        if (!sender.getFamily().equals(receiver.getFamily())) {
            throw new LetterException(LETTER_RECEIVER_FORBIDDEN);
        }
        log.info("Sending letter from user {} to receiver {}", sender, receiver);
    }
}