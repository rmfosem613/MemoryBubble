package com.ssafy.memorybubble.api.auth.security.dto;

import com.ssafy.memorybubble.domain.Role;
import com.ssafy.memorybubble.domain.User;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

import java.util.Map;

@Builder
@Getter
@ToString
public class OAuth2UserInfo {
    private String name;
    private String email;
    private String profile;
    private Role role;

    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes) {
        if (!"kakao".equals(registrationId)) {
            throw new OAuth2AuthenticationException("지원되지 않는 소셜 로그인입니다");
        }

        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");

        return OAuth2UserInfo.builder()
                .name((String) profile.get("nickname"))
                .email((String) account.get("email"))
                .profile((String) profile.get("profile_image_url"))
                .role(Role.USER)
                .build();
    }

    public User toEntity() {
        return User.builder()
                .name(name)
                .email(email)
                .active(true)
                .role(Role.USER)
                .build();
    }
}
