package com.ssafy.memorybubble.api.fcm.controller;

import com.ssafy.memorybubble.api.fcm.dto.FcmDto;
import com.ssafy.memorybubble.api.fcm.service.FcmService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController("/api/fcm")
@RequiredArgsConstructor
@Tag(name = "Fcm Controller", description = "FCM(알림) 관련 Controller 입니다.")
public class FcmController {
    private final FcmService fcmService;

    @PostMapping
    public ResponseEntity<?> getToken(@AuthenticationPrincipal UserDetails userDetails,
                                      @RequestBody FcmDto fcmDto) {
        // fcm 토큰 저장
        fcmService.saveToken(Long.valueOf(userDetails.getUsername()), fcmDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteToken(@AuthenticationPrincipal UserDetails userDetails) {
        // 로그아웃 시 fcm 토큰 삭제
        fcmService.deleteToken(Long.valueOf(userDetails.getUsername()));
        return ResponseEntity.ok().build();
    }
}