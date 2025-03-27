package com.ssafy.memorybubble.api.letter.service;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.ssafy.memorybubble.api.fcm.dto.FcmMessage;
import com.ssafy.memorybubble.api.fcm.service.FcmService;
import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.letter.dto.LetterDetailDto;
import com.ssafy.memorybubble.api.letter.dto.LetterDto;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.ssafy.memorybubble.common.exception.ErrorCode.*;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class LetterService {
    private final LetterRepository letterRepository;
    private final UserService userService;
    private final FileService fileService;
    private final FcmService fcmService;

    @Transactional
    public Object sendLetter(Long userId, LetterRequest letterRequest) {
        // 보내는 user
        User sender = userService.getUser(userId);
        // 받는 user
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

        sendLetterMessage(receiver);
    }

    private void sendLetterMessage(User receiver) {
        // 받는 user에게 알림 전송
        FcmMessage.Notification notification = FcmMessage.Notification.builder()
                .title("추억 방울")
                .body("새로운 편지가 도착했습니다.")
                .build();

        FcmMessage.Message message = FcmMessage.Message.builder()
                .notification(notification)
                .build();

        FcmMessage fcmMessage = FcmMessage.builder()
                .validateOnly(false)  // 실제 전송 여부 설정
                .message(message)
                .build();

        try {
            fcmService.sendMessage(receiver.getId(), fcmMessage);
        } catch (FirebaseMessagingException e) {
            log.warn("Failed to send FCM message to user {}: {}", receiver.getId(), e.getMessage());
        }
    }

    private void validateFamilyRelationship(User sender, User receiver) {
        if (!sender.getFamily().equals(receiver.getFamily())) {
            throw new LetterException(LETTER_RECEIVER_FORBIDDEN);
        }
        log.info("Sending letter from user {} to receiver {}", sender, receiver);
    }

    public List<LetterDto> getLetters(Long userId) {
        List<Letter> letters = letterRepository.findByReceiverId(userId);
        return letters.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LetterDetailDto getLetter(Long userId, Long letterId) {
        User user = userService.getUser(userId);
        Letter letter = letterRepository.findById(letterId).orElseThrow(()-> new LetterException(LETTER_NOT_FOUND));
        // 나에게 온 편지가 아니라면 열람 불가
        if (!letter.getReceiver().equals(user)){
            throw new LetterException(LETTER_ACCESS_DENIED);
        }
        // 아직 열 수 없는 날짜면 열람 불가
        if (letter.getOpenAt().isAfter(LocalDate.now())){
           throw new LetterException(LETTER_OPEN_DENIED);
        }
        // isRead 변경
        letter.updateIsRead(true);
        log.info("Letter updated: {}", letter);
        return converToDetailDto(letter);
    }

    public LetterDto convertToDto(Letter letter) {
        return LetterDto.builder()
                .letterId(letter.getId())
                .type(letter.getType())
                .senderName(letter.getSender().getName())
                .backgroundColor(letter.getBackgroundColor())
                .isRead(letter.getIsRead())
                .openAt(letter.getOpenAt())
                .createdAt(letter.getCreatedAt())
                .build();
    }

    public LetterDetailDto converToDetailDto(Letter letter) {
        String content = letter.getContent();

        // AUDIO인 경우 내용을 음성 파일 presigned url로 전달
        if(letter.getType().equals(Type.AUDIO)) {
            String key = letter.getContent();
            content = fileService.getDownloadPresignedURL(key);
        }

        return LetterDetailDto.builder()
                .type(letter.getType())
                .senderName(letter.getSender().getName())
                .createdAt(letter.getCreatedAt())
                .openAt(letter.getOpenAt())
                .backgroundColor(letter.getBackgroundColor())
                .content(content)
                .build();
    }
}
