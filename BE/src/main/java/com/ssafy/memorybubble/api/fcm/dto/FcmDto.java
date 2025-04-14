package com.ssafy.memorybubble.api.fcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FcmDto {
    // Long userId; // 알림을 보낼 유저 id
    String token; // VAPID 토큰
}