package com.ssafy.memorybubble.api.photo.controller;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.photo.dto.PhotoRequest;
import com.ssafy.memorybubble.api.photo.service.PhotoService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import com.ssafy.memorybubble.domain.Photo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Photo Controller", description = "사진 관련 Controller 입니다.")
public class PhotoController {
    private final PhotoService photoService;

    @PostMapping
    @Operation(
            summary = "사진 업로드 API",
            description = "body에 앨범 id와 사진 갯수를 전달받아서 사진 업로드 url을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (업로드 Presigned Url 리스트 반환)"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<List<FileResponse>> addPhotos(@AuthenticationPrincipal UserDetails userDetails,
                                                        @RequestBody PhotoRequest photoRequest) {
        List<FileResponse> fileResponses = photoService.addPhoto(Long.valueOf(userDetails.getUsername()), photoRequest);
        return ResponseEntity.ok(fileResponses);
    }
}