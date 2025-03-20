package com.ssafy.memorybubble.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CodeService {
    private final RedisTemplate<String, String> redisTemplate;

    // 8자리 숫자 코드
    private String generateRandomCode() {
        UUID uuid = UUID.randomUUID();

        // UUID 마지막 32비트만 가져오기
        long last32BIts = uuid.getLeastSignificantBits() & 0xFFFFFFFFL;

        // 8자리 숫자 범위로 변환
        long numericCode = (last32BIts % 90000000L) + 10000000L;
        return String.valueOf(numericCode);
    }

    // Redis에서 초대 코드 조회
    public String getInviteCode(Long familyId) {
        String key = "invite:" + familyId;
        String existingCode = redisTemplate.opsForValue().get(key);

        if (existingCode != null) {
            return existingCode; // Redis에 코드가 있으면 반환
        }

        // 없으면 새로운 코드 생성 후 저장
        String newCode = generateRandomCode();
        redisTemplate.opsForValue().set(key, newCode, 24, TimeUnit.HOURS); // 유효기간 24시간 설정

        return newCode;
    }
}