package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.exception.FamilyException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static com.ssafy.memorybubble.exception.ErrorCode.FAMILY_NOT_FOUND;
import static com.ssafy.memorybubble.exception.ErrorCode.INVITE_CODE_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
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

        // 없으면 새로운 코드 생성
        String newCode = generateRandomCode();

        // familyId로 code 저장
        redisTemplate.opsForValue().set(key, newCode, 24, TimeUnit.HOURS); // 유효기간 24시간 설정
        // code로 familyId 저장
        redisTemplate.opsForValue().set("code:"+ newCode, String.valueOf(familyId),24, TimeUnit.HOURS);

        return newCode;
    }

    // 초대 코드로 familyId 찾기
    public Long getFamilyIdByCode(String code) {
        String key = "code:" + code;
        String familyId = redisTemplate.opsForValue().get(key);
        if (familyId == null) {
            throw new FamilyException(INVITE_CODE_NOT_FOUND);
        }

        return Long.parseLong(familyId);
    }
}