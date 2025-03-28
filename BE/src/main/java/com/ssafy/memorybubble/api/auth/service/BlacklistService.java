package com.ssafy.memorybubble.api.auth.service;

import static com.ssafy.memorybubble.common.exception.ErrorCode.INVALID_TOKEN;
import com.ssafy.memorybubble.api.auth.exception.TokenException;
import com.ssafy.memorybubble.api.auth.security.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Service
@Slf4j
public class BlacklistService {
    private final TokenProvider tokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private static final String BLACKLIST_PREFIX = "blacklist:";

    public void addBlacklist(String token) {
        String key = BLACKLIST_PREFIX + token;
        Long expiration = tokenProvider.getExpiration(token);
        Long now = new Date().getTime();
        long remainingExpiration = expiration - now;
        // 남은 만료 시간만큼 블랙리스트로 등록
        if(remainingExpiration > 0) redisTemplate.opsForValue().set(key, "true", remainingExpiration, TimeUnit.MILLISECONDS);
    }

    public boolean isBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        if(redisTemplate.opsForValue().get(key) != null) {
            throw new TokenException(INVALID_TOKEN);
        }
        return false;
    }
}