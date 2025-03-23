package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.dto.*;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
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
            description = "body에 가족 이름을 전달하고 가족(그룹)을 생성합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (업로드 Presigned Url 반환)"),
                    @ApiResponse(responseCode = "400", description = "이미 가족(그룹)에 가입되어 있는 사용자입니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<FamilyResponse> addFamily(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody FamilyRequest familyRequest) {
        // 가족 생성
        return ResponseEntity.ok(familyService.addFamily(Long.valueOf(userDetails.getUsername()), familyRequest));
    }

    @Operation(
            summary = "가족 초대코드 발급 API",
            description = "body에 가족 id를 전달하고 가족에 가입할 수 있는 초대 코드를 생성합니다.",
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
            description = "body에 초대코드를 전달하고 가족 id를 받습니다.",
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

    @Operation(
            summary = "가족 가입 후 유저 정보 등록 API",
            description = "body에 유저 정보와 가족 id를 전달하여 가족에 가입하고 유저 정보를 업데이트 합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (presigned Url 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "이미 다른 가족에 가입되어 있습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "이미 가족 정보가 등록되어 있습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @PostMapping("/join")
    public ResponseEntity<FileResponse> joinFamily(@AuthenticationPrincipal UserDetails userDetails,
                                                   @RequestBody JoinRequest joinRequest) {
        // 가족 가입
        return ResponseEntity.ok().body(familyService.join(Long.valueOf(userDetails.getUsername()), joinRequest));
    }

    @Operation(
            summary = "가족 정보 반환 API",
            description = "가족 id로 가족 정보 및 가족에 포함된 유저 정보를 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (가족 정보 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "해당 가족에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @GetMapping("/{familyId}")
    public ResponseEntity<FamilyInfoResponse> getFamily(@AuthenticationPrincipal UserDetails userDetails,
                                                        @PathVariable Long familyId) {
        return ResponseEntity.ok().body(familyService.getFamily(Long.valueOf(userDetails.getUsername()), familyId));
    }

    @Operation(
            summary = "가족 정보 수정 API",
            description = "가족 id로 가족의 정보(이름, 사진)을 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (presigned Url 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "해당 가족에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @PatchMapping("/{familyId}")
    public ResponseEntity<FamilyResponse> updateFamily(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable Long familyId,
                                         @RequestBody FamilyRequest familyRequest) {
        // 가족 수정
        return ResponseEntity.ok().body(
                familyService.updateFamily(Long.valueOf(userDetails.getUsername()), familyId, familyRequest)
        );
    }
}