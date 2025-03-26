package com.ssafy.memorybubble.api.fcm.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@Getter
public class FcmMessage {
    // 실제로 전송될 메세지 데이터
    private boolean validateOnly;
    private Message message;
    @Builder
    @AllArgsConstructor
    @Getter
    public static class Message {
        private Notification notification;
        private String token;
    }
    @Builder
    @AllArgsConstructor
    @Getter
    public static class Notification {
        private String title;
        private String body;
        private String image;
    }
}