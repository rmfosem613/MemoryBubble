package com.ssafy.memorybubble.api.letter.controller;

import com.ssafy.memorybubble.api.letter.dto.LetterDetailDto;
import com.ssafy.memorybubble.api.letter.dto.LetterDto;
import com.ssafy.memorybubble.api.letter.dto.LetterRequest;
import com.ssafy.memorybubble.api.letter.service.LetterService;
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
                    @ApiResponse(responseCode = "200", description = "요청 성공 (AUDIO인 경우 업로드 Presigned Url 반환)"),
                    @ApiResponse(responseCode = "403", description = "가족이 아닌 사용자에게 편지를 보낼 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<?> addLetter(@AuthenticationPrincipal UserDetails userDetails,
                                       @Valid @RequestBody LetterRequest letterRequest) {
        Object result = letterService.sendLetter(Long.valueOf(userDetails.getUsername()), letterRequest);
        if (result == null) {
            // TEXT: null
            return ResponseEntity.ok().build();
        }
        // AUDIO: FileResponse
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @Operation(
            summary = "편지 목록 조회 API",
            description = "받은 편지 목록을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (편지 목록 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<List<LetterDto>> getLetters(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(letterService.getLetters(Long.valueOf(userDetails.getUsername())));
    }

    @GetMapping("/{letterId}")
    @Operation(
            summary = "편지 상세 조회 API",
            description = "받은 편지를 상세 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (편지 상세 내용 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "편지를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "해당 편지를 열람할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "아직 열람할 수 없는 편지입니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<LetterDetailDto> getLetter(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable Long letterId) {
        return ResponseEntity.ok(letterService.getLetter(Long.valueOf(userDetails.getUsername()), letterId));
    }
}