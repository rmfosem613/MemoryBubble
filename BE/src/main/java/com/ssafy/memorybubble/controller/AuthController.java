package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
    @Operation(summary = "로그인 인증 후 redirect")
    public ResponseEntity<?> authSuccess(
            @RequestParam(required = false) Long userId
    ) {
        Map<String, Object> responseData = new HashMap<>();
        User user = userRepository.findById(userId).orElse(null);
        responseData.put("user", user);

        return ResponseEntity.ok(responseData);
    }

}
