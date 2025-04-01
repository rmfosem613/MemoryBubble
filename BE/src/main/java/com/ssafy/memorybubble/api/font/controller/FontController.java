package com.ssafy.memorybubble.api.font.controller;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.font.dto.FontAdminResponse;
import com.ssafy.memorybubble.api.font.dto.FontRequest;
import com.ssafy.memorybubble.api.font.dto.FontResponse;
import com.ssafy.memorybubble.api.font.service.FontService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "Font Controller", description = "폰트 관련 컨트롤러입니다.")
public class FontController {
    private final FontService fontService;

    @GetMapping("/fonts")
    @Operation(
            summary = "폰트 조회 API (사용자)",
            description = "생성된 폰트를 조회하고 폰트 다운로드 링크를 제공합니다. 생성된 폰트가 없다면 컬럼 값이 null 입니다. 아직 폰트가 생성되지 않았다면 status 필드가 REQUESTED 입니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<FontResponse> getFont(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fontService.getFont(Long.parseLong(userDetails.getUsername())));
    }

    @DeleteMapping("/fonts/{font_id}")
    @Operation(
            summary = "폰트 삭제 API (사용자)",
            description = "생성한 폰트를 삭제합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "다른 사용자의 폰트를 삭제할 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "해당 폰트를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> deleteFont(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable("font_id") Long fontId) {
        fontService.deleteFont(Long.parseLong(userDetails.getUsername()), fontId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/fonts/template")
    @Operation(
            summary = "폰트 템플릿 다운로드 API (사용자)",
            description = "폰트 생성에 필요한 템플릿 다운로드 링크를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<FileResponse> getFontTemplate() {
        return ResponseEntity.ok(fontService.getFontTemplate());
    }

    @PostMapping("/fonts")
    @Operation(
            summary = "폰트 생성 요청 API (사용자)",
            description = "폰트 이름과 작성한 폰트 템플릿 이미지를 올릴 링크를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "이미 생성된 폰트가 있습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<List<FileResponse>> addFont(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestBody FontRequest fontRequest) {
        return ResponseEntity.ok(fontService.addFont(Long.parseLong(userDetails.getUsername()), fontRequest));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/fonts")
    @Operation(
            summary = "폰트 생성 요청 목록 API (관리자)",
            description = "관리자가 생성해야 할 폰트 목록을 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "일반 사용자는 접근할 수 없습니다. 관리자만 접근할 수 있습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<List<FontAdminResponse>> fontRequestList(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("userDetails={}", userDetails);
        return ResponseEntity.ok(fontService.fontRequestList());
    }

    /**
     * 폰트 생성 완료 API는 POST /api/admin/fonts/{font_id}를 사용하고 있는데, 이는 REST 원칙상 조금 불명확할 수 있습니다. 리소스 생성이 아닌 상태 변경이라면 PATCH가 더 적절할 수 있습니다
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/fonts/{font_id}")
    @Operation(
            summary = "폰트 생성 완료 API (관리자)",
            description = "관리자가 폰트 생성을 완료합니다. ttf 파일을 올릴 링크를 제공합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "일반 사용자는 접근할 수 없습니다. 관리자만 접근할 수 있습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "해당 폰트를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<FileResponse> makeFont(@PathVariable("font_id") Long fontId) {
        return ResponseEntity.ok(fontService.makeFont(fontId));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/admin/fonts/{font_id}")
    @Operation(
            summary = "폰트 생성 취소 API (관리자)",
            description = "올바르지 않은 파일 내용일 경우 관리자가 폰트 생성을 취소합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "일반 사용자는 접근할 수 없습니다. 관리자만 접근할 수 있습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "해당 폰트를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> cancelFont(@PathVariable("font_id") Long fontId) {
        fontService.cancelFont(fontId);

        return ResponseEntity.ok().build();
    }
}
