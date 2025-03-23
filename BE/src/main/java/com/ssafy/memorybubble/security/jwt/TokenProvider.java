package com.ssafy.memorybubble.security.jwt;

import com.ssafy.memorybubble.dto.TokenDto;
import com.ssafy.memorybubble.exception.TokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.ssafy.memorybubble.common.exception.ErrorCode.INVALID_JWT_SIGNATURE;
import static com.ssafy.memorybubble.common.exception.ErrorCode.INVALID_TOKEN;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenProvider {

    @Value("${jwt.secret}")
    private String secret;
    private SecretKey secretKey; // 설정 파일의 secret은 Base64로 인코딩된 문자
    private static final String GRANT_TYPE = "Bearer";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 3; // 3분
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 3; // 3일

    @PostConstruct
    private void setSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public TokenDto getTokenDto(Authentication authentication) {
        // accessToken과 refreshToken 생성
        String accessToken = generateAccessToken(authentication);
        String refreshToken = generateRefreshToken(authentication);

        return TokenDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // Authentication 객체의 권한 정보 사용해서 access token 생성 및 반환
    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, ACCESS_TOKEN_EXPIRE_TIME);
    }

    // refresh token 생성 및 반환
    public String generateRefreshToken(Authentication authentication) {
        return generateToken(authentication, REFRESH_TOKEN_EXPIRE_TIME);
    }

    // token 생성 함수
    private String generateToken(Authentication authentication, long expireTime) {
        Date now = new Date();
        Date expiredDate = new Date(now.getTime() + expireTime);

        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining());

        return Jwts.builder()
                .subject(authentication.getName())
                .claim("role", authorities)
                .issuedAt(now)
                .expiration(expiredDate)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    // 복호화
    private Claims parseClaims(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build()
                    .parseSignedClaims(token).getPayload();
        }catch (ExpiredJwtException e) {
            // 토큰이 만료되어도 클레임 내용 가져올 수 있음
            return e.getClaims();
        } catch (MalformedJwtException e) {
            throw new TokenException(INVALID_TOKEN);
        } catch (SecurityException e) {
            throw new TokenException(INVALID_JWT_SIGNATURE);
        }
    }

    // 토큰 정보 검증
    public boolean validateToken(String token) {
        if (!StringUtils.hasText(token)) {
            return false; // 토큰이 비어있으면 바로 false 반환
        }
        Claims claims = parseClaims(token);
        return claims.getExpiration().after(new Date());
    }

    // 토큰에 들어있는 인증 정보 꺼냄
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        // 권한 정보 가져옴
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(claims.get("role").toString()));

        UserDetails principal = new User(claims.getSubject(), claims.getSubject(), authorities);
        return new UsernamePasswordAuthenticationToken(principal, null, authorities);
    }

    // 토큰에서 userId 꺼냄
    public String getUserId(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    public Long getExpiration(String token) {
        Claims claims = parseClaims(token);
        return claims.getExpiration().getTime();
    }
}