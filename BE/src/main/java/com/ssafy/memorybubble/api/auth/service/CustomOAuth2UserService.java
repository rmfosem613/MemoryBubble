package com.ssafy.memorybubble.api.auth.service;

import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.repository.UserRepository;
import com.ssafy.memorybubble.api.auth.security.dto.OAuth2UserInfo;
import com.ssafy.memorybubble.api.auth.security.dto.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 유저 정보 가져오기
        Map<String, Object> oAuth2UserAttributes = oAuth2User.getAttributes();

        // third-party id(kakao)
        String registrationId = userRequest.getClientRegistration()
                .getRegistrationId();

        // userNameAttributeName 가져오기
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // 유저 정보 dto 생성
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuth2UserAttributes);
        log.info("Oauth2 User Info: {}", oAuth2UserInfo);

        // 회원가입 및 로그인
        User user = getOrSave(oAuth2UserInfo);
        log.info("User: {}", user);

        PrincipalDetails principalDetails = new PrincipalDetails(user, oAuth2UserAttributes, userNameAttributeName);
        log.info("Principal details getName(): {}", principalDetails.getName());
        log.info("Principal details getUsername(): {}", principalDetails.getUsername());

        return principalDetails;
    }

    private User getOrSave(OAuth2UserInfo oAuth2UserInfo) {
        User user = userRepository.findByEmail(oAuth2UserInfo.getEmail())
                .orElseGet(oAuth2UserInfo::toEntity);
        return userRepository.save(user);
    }
}
