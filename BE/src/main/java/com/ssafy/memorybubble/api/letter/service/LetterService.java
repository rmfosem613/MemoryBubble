package com.ssafy.memorybubble.api.letter.service;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.letter.dto.LetterRequest;
import com.ssafy.memorybubble.api.letter.exception.LetterException;
import com.ssafy.memorybubble.api.letter.repository.LetterRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.domain.Letter;
import com.ssafy.memorybubble.domain.Type;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.ssafy.memorybubble.common.exception.ErrorCode.LETTER_RECEIVER_FORBIDDEN;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class LetterService {
    private final LetterRepository letterRepository;
    private final UserService userService;
    private final FileService fileService;

    @Transactional
    public Object sendLetter(Long userId, LetterRequest letterRequest) {
        User sender = userService.getUser(userId);
        User receiver = userService.getUser(letterRequest.getReceiverId());

        // 가족 관계 검증
        validateFamilyRelationship(sender, receiver);

        if (letterRequest.getType().equals(Type.AUDIO)) {
            // 음성 메세지를 올릴 presigned 주소 생성
            String key = "letter/" + UUID.randomUUID();
            String presignedUrl = fileService.getUploadPresignedUrl(key);

            saveLetter(letterRequest, sender, receiver, key);

            return FileResponse.builder()
                    .fileName(key)
                    .presignedUrl(presignedUrl)
                    .build();
        } else {
            // 텍스트 보내는 경우
            saveLetter(letterRequest, sender, receiver, letterRequest.getContent());
            return null;
        }
    }

    private void saveLetter(LetterRequest request, User sender, User receiver, String content) {
        Letter letter = Letter.builder()
                .type(request.getType())
                .content(content)
                .backgroundColor(request.getBackgroundColor())
                .isRead(false)
                .openAt(request.getOpenAt())
                .sender(sender)
                .receiver(receiver)
                .build();

        letterRepository.save(letter);
        log.info("Letter saved: {}", letter);
    }

    private void validateFamilyRelationship(User sender, User receiver) {
        if (!sender.getFamily().equals(receiver.getFamily())) {
            throw new LetterException(LETTER_RECEIVER_FORBIDDEN);
        }
        log.info("Sending letter from user {} to receiver {}", sender, receiver);
    }
}
