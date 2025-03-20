package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.dto.FamilyRequest;
import com.ssafy.memorybubble.dto.FamilyResponse;
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

    @PostMapping("")
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
}