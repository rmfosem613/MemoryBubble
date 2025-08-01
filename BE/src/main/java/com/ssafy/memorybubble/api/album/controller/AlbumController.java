package com.ssafy.memorybubble.api.album.controller;

import com.ssafy.memorybubble.api.album.dto.*;
import com.ssafy.memorybubble.api.photo.service.PhotoService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import com.ssafy.memorybubble.api.album.service.AlbumService;
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
@RequestMapping("/api/albums")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Album Controller", description = "앨범 관련 Controller 입니다.")
public class AlbumController {
    private final AlbumService albumService;
    private final PhotoService photoService;

    @PostMapping
    @Operation(
            summary = "앨범 생성 API",
            description = "body에 앨범 정보를 전달하고 앨범을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "403", description = "해당 가족에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> addAlbum(@AuthenticationPrincipal UserDetails userDetails,
                                         @Valid @RequestBody AlbumRequest request) {
        albumService.addAlbum(Long.valueOf(userDetails.getUsername()), request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{albumId}/move")
    @Operation(
            summary = "앨범 이동 API",
            description = "body에 이동할 앨범 정보를 전달받아 사진을 다른 앨범으로 이동합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공(이동하는 앨범 id 반환)"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사진을 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<PhotoMoveResponse> moveAlbumPhotos(@AuthenticationPrincipal UserDetails userDetails,
                                                             @PathVariable Long albumId,
                                                             @Valid @RequestBody PhotoMoveRequest request) {
        return ResponseEntity.ok(photoService.movePhotos(Long.valueOf(userDetails.getUsername()), albumId, request));
    }

    @GetMapping
    @Operation(
            summary = "앨범 목록 조회 API",
            description = "이름을 전달하면 이름이 포함된 앨범을 반환하고, 이름이 없으면 모든 앨범 목록을 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "403", description = "해당 가족에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<List<AlbumDto>> getAlbums(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestParam(value="name", required=false) String name) {
        return ResponseEntity.ok(albumService.getAlbums(Long.valueOf(userDetails.getUsername()), name));
    }

    @GetMapping("/{albumId}")
    @Operation(
            summary = "앨범 상세 조회 API",
            description = "앨범에 포함된 사진 id와 url을 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<AlbumDetailDto> getAlbum(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long albumId) {
        return ResponseEntity.ok(albumService.getAlbumDetail(Long.valueOf(userDetails.getUsername()), albumId));
    }

    @PatchMapping("/{albumId}")
    @Operation(
            summary = "앨범 정보 변경 API",
            description = "앨범의 이름, 내용을 변경합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<AlbumUpdateResponse> updateAlbum(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable Long albumId,
                                                           @Valid @RequestBody AlbumUpdateRequest request) {
        return ResponseEntity.ok(albumService.updateAlbum(Long.valueOf(userDetails.getUsername()), albumId, request));
    }


    @PatchMapping("/{albumId}/thumbnail")
    @Operation(
            summary = "앨범 대표 이미지 변경 API",
            description = "앨범의 대표 이미지를 변경합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "403", description = "해당 앨범에 접근할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "앨범에 포함되지 않은 사진입니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사진을 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> updateAlbumThumbnail(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable Long albumId,
                                                     @Valid @RequestBody ThumbnailUpdateRequest request) {
        albumService.updateAlbumThumbnail(Long.valueOf(userDetails.getUsername()), albumId, request.getPhotoId());
        return ResponseEntity.ok().build();
    }
}