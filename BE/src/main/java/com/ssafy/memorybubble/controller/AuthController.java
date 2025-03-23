package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.dto.TokenRequest;
import com.ssafy.memorybubble.dto.TokenResponse;
import com.ssafy.memorybubble.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@Slf4j
@Tag(name = "Auth Controller", description = "OAuth2, jwt 인증 관련 Controller 입니다.")
public class AuthController {

    private final TokenService tokenService;

    @GetMapping("/test")
    @Operation(
            summary = "로그인 test용 API",
            description = "AccessToken을 이용하여 로그인 여부를 확인합니다. AccessToken이 만료되었을 경우 401 오류가 반환됩니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공 (username 반환)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.")
            }
    )
    public ResponseEntity<String> test(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDetails.getUsername());
    }

    @GetMapping("/success")
    @Operation(summary = "소셜 로그인 후 redirect", description = "/api/auth/login에서 소셜 로그인 후 이동하는 페이지 입니다.")
    public ResponseEntity<?> authSuccess(@RequestParam String accessToken, @RequestParam String refreshToken) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("accessToken", accessToken);
        responseData.put("refreshToken", refreshToken);
        responseData.put("message", "인증이 성공적으로 완료되었습니다.");

        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/logout")
    @Operation(
            summary = "로그아웃 API",
            description = "/api/auth/login에서 소셜 로그인 후 Authorize에서 AccessToken을 입력하고 로그아웃 합니다",
            responses = {
                @ApiResponse(responseCode = "200", description = "요청 성공 (반환 값 x)"),
                @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다."),
                @ApiResponse(responseCode = "400", description = "올바르지 않은 토큰입니다.")
            }
    )
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("userDetails.getUsername() logged out : {}", userDetails.getUsername());
        // user가 가진 refresh token 객체 삭제
        tokenService.deleteRefreshToken(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reissue")
    @Operation(
            summary = "Access Token 재발급 API",
            description = "RefreshToken을 body에 넣어 새로운 AccessToken을 발급합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "새로운 accessToken 반환")
            }
    )
    public ResponseEntity<TokenResponse> reissue(@RequestBody TokenRequest tokenRequest) {
        // refresh Token 만료 조회 후 재발급
        String newAccessToken = tokenService.reissueAccessToken(tokenRequest.getRefreshToken());
        if (StringUtils.hasText(newAccessToken)) {
            return ResponseEntity.ok(TokenResponse.builder().accessToken(newAccessToken).build());
        }
        return ResponseEntity.badRequest().build();
    }
}
