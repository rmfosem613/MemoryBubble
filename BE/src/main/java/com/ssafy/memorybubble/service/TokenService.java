package com.ssafy.memorybubble.service;

import static com.ssafy.memorybubble.exception.ErrorCode.INVALID_TOKEN;
import com.ssafy.memorybubble.exception.TokenException;
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
    private final BlacklistService blacklistService;

    // 로그인 시 refresh token을 새로 저장
    public void saveRefreshToken(String id, String accessToken, String refreshToken) {
        tokenRepository.save(new RefreshToken(id, accessToken, refreshToken));
    }

    // 로그아웃 시 refresh token 삭제
    public void deleteRefreshToken(String id) {
        // refresh token 삭제
        RefreshToken token = tokenRepository.findById(id).orElse(null);
        if (token != null) {
            String accessToken = token.getAccessToken();
            // accessToken이 유효기간이 남아있으면 blacklist에 등록
            blacklistService.addBlacklist(accessToken);
            log.info("add blacklist access token: {}", accessToken);

            // refreshToken의 유효기간이 남아있으면 blacklist에 등록
            blacklistService.addBlacklist(token.getRefreshToken());
            log.info("add blacklist refresh token: {}", token.getRefreshToken());

            tokenRepository.deleteById(id);
            log.info("Deleting refresh token {}", id);
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
                String accessToken = resultToken.getAccessToken();
                if(!blacklistService.isBlacklisted(accessToken)) {
                    // 기존 accessToken이 만료되지 않았다면 블랙리스트에 넣음
                    blacklistService.addBlacklist(accessToken);
                    // 새로운 accessToken으로 업데이트
                    resultToken.updateAccessToken(newAccessToken);
                    tokenRepository.save(resultToken);
                }
            }
            return newAccessToken;
        }
        else {
            throw new TokenException(INVALID_TOKEN);
        }
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