package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.dto.*;
import com.ssafy.memorybubble.exception.ErrorResponse;
import com.ssafy.memorybubble.service.FamilyService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/family")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Family Controller", description = "가족(그룹) 관련 Controller 입니다.")
public class FamilyController {

    private final FamilyService familyService;

    @PostMapping
    @Operation(
            summary = "가족 생성 API",
            description = "body에 familyName을 전달하고 가족(그룹)을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (업로드 Presigned Url 반환)"),
                    @ApiResponse(responseCode = "400", description = "이미 가족(그룹)에 가입되어 있는 사용자입니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<FamilyResponse> addFamily(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody FamilyRequest familyRequest) {
        // 그룹 생성
        FamilyResponse familyResponse = familyService.addFamily(Long.valueOf(userDetails.getUsername()), familyRequest);
        return ResponseEntity.ok(familyResponse);
    }

    @Operation(
            summary = "가족 초대코드 발급 API",
            description = "body에 familyName을 전달하고 가족(그룹)을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (초대 코드 8자리 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "해당 그룹에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    @GetMapping("/{familyId}/invite")
    public ResponseEntity<CodeDto> getCode(@AuthenticationPrincipal UserDetails userDetails,
                                             @PathVariable Long familyId) {
        // 요청 코드 반환
        return ResponseEntity.ok(familyService.getInviteCode(Long.valueOf(userDetails.getUsername()), familyId));
    }

    @Operation(
            summary = "가족 초대코드 확인 API",
            description = "body에 code를 전달하고 familyId를 받습니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (familyId 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "유효하지 않은 코드입니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    @PostMapping("/code")
    public ResponseEntity<CodeResponse> confirmCode(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody CodeDto codeDto) {
        // 유효한 code인지 확인하고 familyId 반환
        return ResponseEntity.ok(familyService.getFamilyIdByCode(codeDto));
    }

    @PostMapping("/join")
    public ResponseEntity<FileResponse> joinFamily(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody JoinRequest joinRequest) {
        // 그룹 가입
        return ResponseEntity.ok().body(familyService.join(Long.valueOf(userDetails.getUsername()), joinRequest));
    }
}