package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.dto.AlbumRequest;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import com.ssafy.memorybubble.service.AlbumService;
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

@RestController
@RequestMapping("/api/albums")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Album Controller", description = "앨범 관련 Controller 입니다.")
public class AlbumController {
    private final AlbumService albumService;

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
                                         @RequestBody AlbumRequest albumRequest) {
        albumService.addAlbum(Long.valueOf(userDetails.getUsername()), albumRequest);
        return ResponseEntity.ok().build();
    }
}