package com.ssafy.memorybubble.api.font.service;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.ssafy.memorybubble.api.family.dto.FamilyFontDto;
import com.ssafy.memorybubble.api.family.exception.FamilyException;
import com.ssafy.memorybubble.api.fcm.dto.FcmMessage;
import com.ssafy.memorybubble.api.fcm.service.FcmService;
import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.font.dto.FontAdminResponse;
import com.ssafy.memorybubble.api.font.dto.FontRequest;
import com.ssafy.memorybubble.api.font.dto.FontResponse;
import com.ssafy.memorybubble.api.font.exception.FontException;
import com.ssafy.memorybubble.api.font.repository.FontRepository;
import com.ssafy.memorybubble.api.user.repository.UserRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.common.util.Validator;
import com.ssafy.memorybubble.domain.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.ssafy.memorybubble.common.exception.ErrorCode.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FontService {
    private final FontRepository fontRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final FileService fileService;
    private final FcmService fcmService;

    private final static String TEMPLATE_FILE = "template/추억방울_템플릿.zip";
    private final static String TEMPLATE_FILE_NAME = "template/%d/%d.png"; // template/{userId}/{templateNumber}.png
    private final static int TEMPLATE_FILE_COUNT = 8; // 템플릿 파일의 개수
    private final static String FONT_PATH = "font/%d/%s.ttf"; // font/{userId}/{fontName}.ttf

    // 사용자 - 폰트 조회
    @Transactional(readOnly = true)
    public FontResponse getFont(Long userId) {
        User user = userService.getUser(userId);
        log.info("user={}", user);

        Font font = fontRepository.findByUser(user).orElse(null);
        // 만들어진 폰트가 없는 경우
        if (font == null) {
            return FontResponse.builder()
                    .status(FontStatus.NOT_CREATED)
                    .build();
        }
        log.info("font={}", font);

        return convertToFontResponse(font);
    }

    // Font to FontResponse
    private FontResponse convertToFontResponse(Font font) {
        return FontResponse.builder()
                .fontId(font.getId())
                .fontName(font.getName())
                .fileName(font.getPath())
                .createdAt(font.getCreatedAt())
                .presignedUrl(font.getFontStatus() == FontStatus.DONE? fileService.getDownloadPresignedURL(font.getPath()) : null)
                .status(font.getFontStatus())
                .build();
    }

    // 사용자 - 폰트 삭제
    public void deleteFont(Long userId, Long fontId) {
        User user = userService.getUser(userId);
        Font font = fontRepository.findById(fontId)
                .orElseThrow(() -> new FontException(FONT_NOT_FOUND));

        // 삭제하려는 폰트가 삭제를 요청한 사용자의 폰트인지 검사
        Validator.validateFontOwnership(user, font);

        fontRepository.deleteById(fontId);
    }

    // 사용자 - 폰트 템플릿 다운로드
    @Transactional(readOnly = true)
    public FileResponse getFontTemplate() {
        return fileService.createDownloadFileResponse(TEMPLATE_FILE);
    }

    // 사용자 - 폰트 생성 요청
    public List<FileResponse> addFont(Long userId, FontRequest fontRequest) {
        User user = userService.getUser(userId);

        Font savedFont = fontRepository.findByUser(user).orElse(null);
        // 이미 생성된 폰트가 있는 경우
        if (savedFont != null) {
            throw new FontException(FONT_BAD_REQUEST);
        }

        String fontName = fontRequest.getFontName() + "체";
        // 폰트 정보 저장
        Font font = Font.builder()
                .user(user)
                .name(fontName)
                .path(String.format(FONT_PATH, userId, fontName))
                .build();
        fontRepository.save(font);
        log.info("font={}", font);

        // 작성한 템플릿을 올릴 Presigned URL 목록
        List<FileResponse> fileResponseList = IntStream.rangeClosed(1, TEMPLATE_FILE_COUNT)
                .mapToObj(i -> {
                    String templateFile = String.format(TEMPLATE_FILE_NAME, userId, i);
                    return fileService.createUploadFileResponse(templateFile);
                })
                .collect(Collectors.toList());
        log.info("fileResponseList={}", fileResponseList);

        // 관리자에게 폰트 생성 요청 알림(FCM) 보내기
        userRepository.findAllByRole(Role.ADMIN)
                .forEach(admin -> sendFontMessage(admin, "추억 방울", "새로운 폰트 생성 요청이 있습니다."));
        return fileResponseList;
    }

    // 관리자 - 폰트 생성 요청 목록
    public List<FontAdminResponse> fontRequestList() {
        return fontRepository.findAllByFontStatus(FontStatus.REQUESTED)
                .stream()
                .map(font -> {
                    User user = font.getUser();
                    return convertToFontAdminDto(user, font);
                })
                .toList();
    }

    private FontAdminResponse convertToFontAdminDto(User user, Font font) {
        List<FileResponse> files = IntStream.rangeClosed(1, TEMPLATE_FILE_COUNT)
                .mapToObj(i -> {
                    String templateFile = String.format(TEMPLATE_FILE_NAME, user.getId(), i);
                    return fileService.createDownloadFileResponse(templateFile);
                })
                .toList();

        return FontAdminResponse.builder()
                .fontId(font.getId())
                .userName(user.getName())
                .fontName(font.getName())
                .files(files)
                .build();
    }

    // 관리자 - 폰트 생성 완료
    public FileResponse makeFont(Long fontId) {
        Font font = fontRepository.findById(fontId)
                .orElseThrow(() -> new FontException(FONT_NOT_FOUND));

        User user = font.getUser();

        // 폰트 생성 상태 업데이트
        font.updateStatus();

        // 사용자에게 폰트 생성 완료 알림 보내기
        sendFontMessage(user, "추억 방울", "폰트 생성이 완료되었습니다.");

        // ttf 파일 업로드할 Presigned URL 리턴
        String fontPath = String.format(FONT_PATH, user.getId(), font.getName());
        return fileService.createUploadFileResponse(fontPath);
    }

    // 관리자 - 폰트 생성 취소
    public void cancelFont(Long fontId) {
        Font font = fontRepository.findById(fontId)
                .orElseThrow(() -> new FontException(FONT_NOT_FOUND));

        fontRepository.delete(font);

        // 사용자에게 폰트 생성 취소 알림 보내기
        sendFontMessage(font.getUser(), "추억 방울", "파일의 내용이 올바르지 않아 폰트를 생성할 수 없습니다. 새로운 파일로 다시 요청해주세요.");
    }

    private void sendFontMessage(User receiver, String title, String body) {
        FcmMessage.Notification notification = FcmMessage.Notification.builder()
                .title(title)
                .body(body)
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

    public List<FamilyFontDto> getFamilyFont(Long userId, Long familyId) {
        User user = userService.getUser(userId);
        log.info("user={}", user);

        Family family = user.getFamily();
        log.info("family={}", family);

        // 그룹에 가입되어 있지 않거나 다른 그룹에 가입되어 있는 경우
        if (family == null || !family.getId().equals(familyId)) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }

        // 가족 구성원 전체 조회 & 폰트 조회
        return userService.getUsersByFamilyId(familyId)
                .stream()
                .map(this::convertToFamilyFontDto)
                .toList();
    }

    private FamilyFontDto convertToFamilyFontDto(User user) {
        FontResponse font = getFont(user.getId());

        return FamilyFontDto.builder()
                .userId(user.getId())
                .userName(user.getName())
                .fontName(font.getFontName())
                .fileName(font.getStatus() == FontStatus.DONE? fileService.getDownloadPresignedURL(font.getFileName()) : null)
                .status(font.getStatus())
                .build();
    }
}
