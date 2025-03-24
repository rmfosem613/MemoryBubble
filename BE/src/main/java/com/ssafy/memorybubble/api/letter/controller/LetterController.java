package com.ssafy.memorybubble.api.letter.controller;

import com.ssafy.memorybubble.api.letter.dto.LetterRequest;
import com.ssafy.memorybubble.api.letter.service.LetterService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
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
@RequestMapping("/api/letters")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Letter Controller", description = "편지 관련 Controller 입니다.")
public class LetterController {
    private final LetterService letterService;

    @PostMapping
    @Operation(
            summary = "편지 전송 API",
            description = "body에 편지 내용을 받아 다른 사용자에게 편지를 전송 합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (업로드 Presigned Url 반환)"),
                    @ApiResponse(responseCode = "403", description = "가족이 아닌 사용자에게 편지를 보낼 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<?> addLetter(@AuthenticationPrincipal UserDetails userDetails,
                                       @RequestBody LetterRequest letterRequest) {
        Object result = letterService.sendLetter(Long.valueOf(userDetails.getUsername()), letterRequest);
        if (result == null) {
            // TEXT: null
            return ResponseEntity.ok().build();
        }
        // AUDIO: FileResponse
        return ResponseEntity.ok(result);
    }
}
