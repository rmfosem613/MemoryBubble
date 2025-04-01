package com.ssafy.memorybubble.api.photo.controller;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.photo.dto.PhotoRequest;
import com.ssafy.memorybubble.api.photo.dto.ReviewDto;
import com.ssafy.memorybubble.api.photo.dto.ReviewRequest;
import com.ssafy.memorybubble.api.photo.service.PhotoService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
                                                        @Valid @RequestBody PhotoRequest photoRequest) {
        List<FileResponse> fileResponses = photoService.addPhoto(Long.valueOf(userDetails.getUsername()), photoRequest);
        return ResponseEntity.ok(fileResponses);
    }

    @PostMapping("/{photoId}/review")
    @Operation(
            summary = "감상평 업로드 API",
            description = "body에 감상평 정보를 전달받아 감상평을 등록합니다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (AUDIO인 경우 업로드 Presigned Url 반환)"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사진을 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<?> addReview(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable Long photoId,
                                       @Valid @RequestBody ReviewRequest reviewRequest) {
        Object result = photoService.addReview(Long.valueOf(userDetails.getUsername()), photoId, reviewRequest);
        if (result == null) {
            // TEXT: null
            return ResponseEntity.ok().build();
        }
        // AUDIO: FileResponse
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{photoId}")
    @Operation(
            summary = "사진 상세 조회 API",
            description = "사진에 등록된 감상평을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (감상평 목록)"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사진을 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<List<ReviewDto>> getPhotoReviews(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable Long photoId) {
        return ResponseEntity.ok(photoService.getPhotoReviews(Long.valueOf(userDetails.getUsername()), photoId));
    }
}