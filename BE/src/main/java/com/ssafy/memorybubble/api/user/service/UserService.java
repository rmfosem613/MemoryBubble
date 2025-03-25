package com.ssafy.memorybubble.api.user.service;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.user.dto.ProfileDto;
import com.ssafy.memorybubble.api.user.dto.UserDto;
import com.ssafy.memorybubble.api.user.dto.UserRequest;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import static com.ssafy.memorybubble.common.exception.ErrorCode.USER_NOT_FOUND;

import com.ssafy.memorybubble.api.family.dto.JoinRequest;
import com.ssafy.memorybubble.api.user.dto.UserInfoDto;
import com.ssafy.memorybubble.api.user.exception.UserException;
import com.ssafy.memorybubble.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final FileService fileService;

    public User getUser (Long userId){
        return userRepository.findById(userId).orElseThrow(()->new UserException(USER_NOT_FOUND));
    }

    @Transactional
    public void updateUserFamily (User user, Family family) {
        // family가 생성되면 user에 family 추가
        log.info("Updating user family {}", family);
        user.updateUserFamily(family);
    }

    @Transactional
    public void updateUser(User user, JoinRequest joinRequest, String profile) {
        // 이름, 프로필, 휴대폰번호, 성별, 생일 업데이트
        log.info("Updating user {}", user);
        user.updateUser(joinRequest.getName(), profile, joinRequest.getPhoneNumber(),
                joinRequest.getGender(), joinRequest.getBirth());
    }

    @Transactional
    public FileResponse updateUser(Long userId, UserRequest userRequest) {
        User user = getUser(userId);
        // 프로필 이미지를 바꿀 수 있는 url 반환
        String presignedUrl = fileService.getUploadPresignedUrl(user.getProfile());
        user.updateUser(userRequest.getName(), user.getProfile(), userRequest.getPhoneNumber(), userRequest.getGender(), userRequest.getBirth());
        return FileResponse.builder()
                .fileName(user.getProfile())
                .presignedUrl(presignedUrl)
                .build();
    }

    public ProfileDto getUserProfile (Long userId) {
        User user = getUser(userId);
        UserInfoDto userInfoDto = convertToDto(user);
        return ProfileDto.builder()
                .name(userInfoDto.getName())
                .phoneNumber(userInfoDto.getPhoneNumber())
                .profileUrl(userInfoDto.getProfileUrl())
                .birth(userInfoDto.getBirth())
                .familyId(user.getFamily() != null ? user.getFamily().getId() : null)
                .gender(user.getGender())
                .build();
    }

    public List<User> getUsersByFamilyId(Long familyId) {
        return userRepository.findByFamilyId(familyId);
    }

    public UserDto getUserDto (Long userId) {
        User user = getUser(userId);
        return UserDto.builder()
                .familyId(user.getFamily() != null ? user.getFamily().getId() : null)
                .userId(userId)
                .build();
    }
    public UserInfoDto convertToDto(User user) {
        // 유저 프로필 presigned url로 반환
        String profileUrl = fileService.getDownloadPresignedURL(user.getProfile());
        return UserInfoDto.builder()
                .name(user.getName())
                .profileUrl(profileUrl)
                .birth(user.getBirth())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}