package com.ssafy.memorybubble.api.fcm.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.ssafy.memorybubble.api.fcm.dto.FcmDto;
import com.ssafy.memorybubble.api.fcm.dto.FcmMessage;
import com.ssafy.memorybubble.api.fcm.service.FcmService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
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

@Slf4j
@RestController
@RequestMapping("/api/fcm")
@RequiredArgsConstructor
@Tag(name = "Fcm Controller", description = "FCM(알림) 관련 Controller 입니다.")
public class FcmController {
    private final FcmService fcmService;

    @PostMapping
    @Operation(
            summary = "Fcm 토큰 전송 API",
            description = "로그인 후 body에 Fcm 토큰을 담아 전송하여 서버에서 저장합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> getToken(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody FcmDto fcmDto) {
        // fcm 토큰 저장
        fcmService.saveToken(Long.valueOf(userDetails.getUsername()), fcmDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteToken(@AuthenticationPrincipal UserDetails userDetails) {
        // 로그아웃 시 fcm 토큰 삭제
        fcmService.deleteToken(Long.valueOf(userDetails.getUsername()));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{receiverId}")
    @PostMapping
    @Operation(
            summary = "알림 테스트 API",
            description = "로그인 후 알림을 받을 사람의 id를 넣고 알림 테스트를 합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> sendMessage(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable("receiverId") Long receiverId) throws FirebaseMessagingException {
        FcmMessage fcmMessage = FcmMessage.builder()
                .message(FcmMessage.Message.builder()
                        .notification(
                                FcmMessage.Notification.builder()
                                        .title("알림")
                                        .body("테스트")
                                        .build()
                        ).build())
                .build();
        fcmService.sendMessage(receiverId, fcmMessage);
        return ResponseEntity.ok().build();
    }
}