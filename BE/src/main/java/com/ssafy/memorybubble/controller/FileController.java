package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/file")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "File Controller", description = "파일 테스트 관련 Controller 입니다.")
public class FileController {
    private final FileService fileService;

    @Operation(
            summary = "S3 파일 업로드 PresignedUrl test용 API",
            description = "로그인 후 파일 업로드 테스트",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (업로드 Presigned Url 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.")
            }
    )
    @GetMapping("/upload")
    public ResponseEntity<String> getPresignedUploadUrl(@AuthenticationPrincipal UserDetails userDetails) {
        String presignedUrl = fileService.getUploadPresignedUrl(userDetails.getUsername());
        return ResponseEntity.ok(presignedUrl);
    }

    @Operation(
            summary = "S3 파일 다운로드 PresignedUrl test용 API",
            description = "로그인 후 파일 다운로드 테스트",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (다운로드 PresignedUrl 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.")
            }
    )
    @GetMapping("/download")
    public ResponseEntity<String> getPresignedDownloadUrl(@AuthenticationPrincipal UserDetails userDetails) {
        String presignedUrl = fileService.getDownloadPresignedURL(userDetails.getUsername());
        return ResponseEntity.ok(presignedUrl);
    }
}