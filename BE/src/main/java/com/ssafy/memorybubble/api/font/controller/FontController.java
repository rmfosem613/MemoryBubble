package com.ssafy.memorybubble.api.font.controller;

import com.ssafy.memorybubble.api.family.dto.FamilyFontDto;
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
            description = """
                        생성된 폰트를 조회하고 폰트 다운로드 링크를 제공합니다.
                        조회 시 폰트 상태(status)는 다음과 같이 제공됩니다:
                        - NOT_CREATED: 폰트 생성을 요청한 적이 없는 경우
                        - REQUESTED: 폰트 생성이 요청되어 처리 중인 경우
                        - DONE: 폰트 생성이 완료되어 다운로드 가능한 경우
                        """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<FontResponse> getFont(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fontService.getFont(Long.parseLong(userDetails.getUsername())));
    }

    @DeleteMapping("/fonts/{fontId}")
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
                                           @PathVariable Long fontId) {
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

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin/fonts/{fontId}")
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
    public ResponseEntity<FileResponse> makeFont(@PathVariable Long fontId) {
        return ResponseEntity.ok(fontService.makeFont(fontId));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/admin/fonts/{fontId}")
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
    public ResponseEntity<Void> cancelFont(@PathVariable Long fontId) {
        fontService.cancelFont(fontId);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "가족 폰트 조회 API",
            description = """
                        가족 id로 가족의 전체 폰트를 조회합니다.
                        폰트 상태(status)는 다음과 같이 제공됩니다:
                        - NOT_CREATED: 폰트 생성을 요청한 적이 없는 경우
                        - REQUESTED: 폰트 생성이 요청되어 처리 중인 경우
                        - DONE: 폰트 생성이 완료되어 사용이 가능한 경우
                        """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "해당 가족에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @GetMapping("/fonts/family/{familyId}")
    public ResponseEntity<List<FamilyFontDto>> getFamilyFont(@AuthenticationPrincipal UserDetails userDetails,
                                                             @PathVariable Long familyId) {
        return ResponseEntity.ok(fontService.getFamilyFont(Long.parseLong(userDetails.getUsername()), familyId));
    }
}
