package com.ssafy.memorybubble.api.auth.security.dto;

import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@ToString
public class PrincipalDetails implements OAuth2User, UserDetails {
    private final User user;
    private final Map<String, Object> attributes;
    private final String attributeKey;

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        log.info("userRole={}", user.getRole());
        return Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().toString()));
//        return Collections.singletonList(
//                new SimpleGrantedAuthority("user"));
    }

    @Override
    public String getPassword() {
        return null;
    }

    // DB의 userId 반환
    @Override
    public String getUsername() {
        return String.valueOf(user.getId());
    }

    // oauth의 userId 반환
    @Override
    public String getName() {
        return attributes.get(attributeKey).toString();
    }
}
