package com.ssafy.memorybubble.api.font.service;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.font.dto.FontAdminRequest;
import com.ssafy.memorybubble.api.font.dto.FontAdminResponse;
import com.ssafy.memorybubble.api.font.dto.FontRequest;
import com.ssafy.memorybubble.api.font.dto.FontResponse;
import com.ssafy.memorybubble.api.font.exception.FontException;
import com.ssafy.memorybubble.api.font.repository.FontRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.common.util.Validator;
import com.ssafy.memorybubble.domain.Font;
import com.ssafy.memorybubble.domain.FontStatus;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.ssafy.memorybubble.common.exception.ErrorCode.FONT_BAD_REQUEST;
import static com.ssafy.memorybubble.common.exception.ErrorCode.FONT_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FontService {
    private final FontRepository fontRepository;
    private final UserService userService;
    private final FileService fileService;

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
            return FontResponse.builder().build();
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
                .fontNameEng(font.getNameEng())
                .createdAt(font.getCreatedAt())
                .presignedUrl(fileService.getDownloadPresignedURL(font.getPath()))
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

        // 폰트 정보 저장
        Font font = Font.builder()
                .user(user)
                .name(fontRequest.getFontName())
                .nameEng(fontRequest.getFontNameEng())
                .path(String.format(FONT_PATH, userId, fontRequest.getFontName()))
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

        // TODO: 관리자에게 폰트 생성 요청 알림(FCM) 보내기

        return fileResponseList;
    }

    // 관리자 - 폰트 생성 요청 목록
    public List<FontAdminResponse> fontRequestList() {
        return fontRepository.findAllByFontStatus(FontStatus.REQUESTED)
                .stream()
                .map(font -> {
                    User user = userService.getUser(font.getUser().getId());
                    return convertToFontAdminDto(user, font.getName());
                })
                .toList();
    }

    private FontAdminResponse convertToFontAdminDto(User user, String fontName) {
        List<FileResponse> files = IntStream.rangeClosed(1, TEMPLATE_FILE_COUNT)
                .mapToObj(i -> {
                    String templateFile = String.format(TEMPLATE_FILE_NAME, user.getId(), i);
                    return fileService.createDownloadFileResponse(templateFile);
                })
                .toList();

        return FontAdminResponse.builder()
                .userId(user.getId())
                .userName(user.getName())
                .fontName(fontName)
                .files(files)
                .build();
    }

    // 관리자 - 폰트 생성 완료
    public FileResponse makeFont(FontAdminRequest fontAdminRequest) {
        User user = userService.getUser(fontAdminRequest.getUserId());
        Font font = fontRepository.findByUser(user)
                .orElseThrow(() -> new FontException(FONT_NOT_FOUND));

        // 폰트 생성 상태 업데이트
        font.updateStatus();

        // TODO: 사용자에게 폰트 생성 완료 알림 보내기

        // ttf 파일 업로드할 Presigned URL 리턴
        String fontPath = String.format(FONT_PATH, user.getId(), font.getName());
        return fileService.createUploadFileResponse(fontPath);
    }
}
