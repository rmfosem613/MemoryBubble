package com.ssafy.memorybubble.api.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.ssafy.memorybubble.api.fcm.dto.FcmDto;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FcmService {
    private final FirebaseMessaging firebaseMessaging;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserService userService;

    public void saveToken(Long userId, FcmDto fcmDto) {
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
}