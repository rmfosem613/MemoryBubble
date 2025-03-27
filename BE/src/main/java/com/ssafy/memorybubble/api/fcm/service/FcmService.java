package com.ssafy.memorybubble.api.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.memorybubble.api.fcm.dto.FcmDto;
import com.ssafy.memorybubble.api.fcm.dto.FcmMessage;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class FcmService {
    private final FirebaseMessaging firebaseMessaging;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserService userService;

    public void saveToken(Long userId, FcmDto fcmDto) {
        log.info("fcmDto.getToken(): {}", fcmDto.getToken());
        User user = userService.getUser(userId);
        // fcm token을 redis에 저장
        String key = "fcm:" + user.getId();
        redisTemplate.opsForValue().set(key, fcmDto.getToken());
    }

    public void deleteToken(Long userId) {
        User user = userService.getUser(userId);
        String key = "fcm:" + user.getId();
        redisTemplate.delete(key);
    }

    public String getToken(Long userId) {
        User user = userService.getUser(userId);
        String key = "fcm:" + user.getId();
        return redisTemplate.opsForValue().get(key);
    }

    public void sendMessage(Long receiverId, FcmMessage fcmMessage) throws FirebaseMessagingException {
        String token = getToken(receiverId);
        log.info("token: {}", token);

        // TODO: 토큰이 없는 경우 예외 처리
        if (!StringUtils.hasText(token)) {
            log.warn("No FCM token found for user: {}", receiverId);
            return;
        }

        FcmMessage.Notification notification = fcmMessage.getMessage().getNotification();
        if (notification == null) {
            log.error("Notification is null");
            return;
        }
        log.info("notification.getTitle(): {}", notification.getTitle());
        log.info("notification.getBody(): {}", notification.getBody());

        Message message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(notification.getTitle())
                        .setBody(notification.getBody())
                        .build())
                .setToken(token)  // 대상 디바이스의 등록 토큰
                .build();

        try {
            // 동기 방식으로 변경하여 전송 결과 확인
            String response = firebaseMessaging.send(message);
            log.info("Successfully sent message: {}", response);
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send message to token: {}", token, e);
            throw e;
        }
    }
}