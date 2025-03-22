package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.repository.TokenRepository;
import com.ssafy.memorybubble.security.dto.RefreshToken;
import com.ssafy.memorybubble.security.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class TokenService {
    private final TokenRepository tokenRepository;
    private final TokenProvider tokenProvider;

    // 로그인 시 refresh token을 새로 저장
    public void saveRefreshToken(String id, String accessToken, String refreshToken) {
        tokenRepository.save(new RefreshToken(id, accessToken, refreshToken));
    }

    // 로그아웃 시 refresh token 삭제
    public void deleteRefreshToken(String id) {
        RefreshToken token = tokenRepository.findById(id).orElse(null);
        if (token != null) {
            log.info("Deleting refresh token {}", id);
            tokenRepository.deleteById(id);
        }
    }

    // refresh token 유효성 검증 후 access token 재발급
    public String reissueAccessToken(String refreshToken) {
        // refreshToken이 유효한지 검증
        if (tokenProvider.validateToken(refreshToken)) {
            Authentication authentication = tokenProvider.getAuthentication(refreshToken);
            Optional<RefreshToken> token = tokenRepository.findById(authentication.getName());

            String newAccessToken = tokenProvider.generateAccessToken(authentication);
            log.info("새 accessToken 생성: {}", newAccessToken);

            if(token.isPresent()) {
                RefreshToken resultToken = token.get();
                resultToken.updateAccessToken(newAccessToken);
                tokenRepository.save(resultToken);
            }
            return newAccessToken;
        }
        return null;

        // accessToken으로 refreshToken의 유효성 검증 후 accessToken 재발급
        /*Optional<RefreshToken> token = tokenRepository.findByAccessToken(accessToken);

        // refresh token 검증
        if(token.isPresent() && tokenProvider.validateToken(token.get().getRefreshToken())) {
            log.info("Refresh token validated");
            RefreshToken resultToken = token.get();
            log.info("resultToken.getAccessToken: {}", resultToken.getAccessToken());
            log.info("resultToken.getRefreshToken: {}", resultToken.getRefreshToken());

            String refreshToken = resultToken.getRefreshToken();
            Authentication authentication = tokenProvider.getAuthentication(refreshToken);
            String newAccessToken = tokenProvider.generateAccessToken(authentication);

            // refresh token에 저장되어 있던 access token 값 수정
            resultToken.updateAccessToken(newAccessToken);
            tokenRepository.save(resultToken);
            return newAccessToken;
        }*/
    }
}