package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@Slf4j
@Tag(name = "Auth Controller", description = "OAuth2 인증 관련 Controller 입니다.")
public class AuthController {

    private final UserRepository userRepository;

    @GetMapping("/success")
    @Operation(summary = "소셜 로그인 후 redirect", description = "/api/auth/login에서 소셜 로그인 후 이동하는 페이지 입니다.")
    public ResponseEntity<?> authSuccess(@RequestParam String accessToken) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("accessToken", accessToken);
        responseData.put("message", "인증이 성공적으로 완료되었습니다.");

        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/logout")
    @Operation(summary = "로그아웃", description = "/api/auth/login에서 소셜 로그인 후 Authorize에서 AccessToken을 입력하고 로그아웃 합니다"
    )
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("userDetails.getUsername() logged out : {}", userDetails.getUsername());
        // access token으로 refresh token 삭제
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("username", userDetails.getUsername());
        responseData.put("message", "로그아웃이 성공적으로 완료되었습니다.");
        return ResponseEntity.ok(responseData);
    }
}
