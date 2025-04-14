package com.ssafy.memorybubble.api.user.service;

import com.ssafy.memorybubble.api.family.dto.FamilyJoinRequest;
import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.letter.repository.LetterRepository;
import com.ssafy.memorybubble.api.user.dto.*;
import com.ssafy.memorybubble.api.user.exception.UserException;
import com.ssafy.memorybubble.api.user.repository.UserRepository;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.ssafy.memorybubble.common.exception.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final FileService fileService;
    private final LetterRepository letterRepository;

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
    public void updateUser(User user, FamilyJoinRequest request, String profile) {
        // 이름, 프로필, 휴대폰번호, 성별, 생일 업데이트
        log.info("Updating user {}", user);
        user.updateUser(request.getName(), profile, request.getPhoneNumber(),
                request.getGender(), request.getBirth());
    }

    @Transactional
    public FileResponse updateUser(Long userId, UserUpdateRequest request) {
        // 프로필 이미지를 바꿀 수 있는 url 반환
        User user = getUser(userId);
        String key = user.getProfile();

        // 프로필 이미지를 업데이트하는 경우
        if (request.getIsProfileUpdate()) {
            // 기존 프로필 이미지 삭제
            fileService.deleteFile(user.getProfile());

            // 새로운 프로필 이미지 url 반환
            key = "user/" + UUID.randomUUID();
        }

        user.updateUser(request.getName(), key, request.getPhoneNumber(), request.getGender(), request.getBirth());

        return fileService.createUploadFileResponse(key);
    }

    public UnreadLetterResponse getUnreadLetter(Long userId) {
        User user = getUser(userId);
        return UnreadLetterResponse.builder()
                .isUnread(letterRepository.existsByReceiverIdAndIsReadFalse(user.getId()))
                .build();
    }

    public JoinResponse getJoinAvailable(Long userId) {
        User user = getUser(userId);
        //유저의 정보가 이미 기입되어 있으면 가입한 것이므로 false 반환 -> 가입 페이지 접근 불가
        if (user.getProfile() != null || user.getBirth() != null || user.getPhoneNumber() != null || user.getGender() != null) {
            return JoinResponse.builder()
                    .isJoinAvailable(false)
                    .build();
        }
        // 가입 페이지 접근 가능
        return JoinResponse.builder()
                .isJoinAvailable(true)
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
                .role(user.getRole())
                .build();
    }

    public UserInfoDto getUserInfoDto (User user) {
        return convertToDto(user);
    }

    private UserInfoDto convertToDto(User user) {
        // 유저 프로필이 있으면 유저 프로필 presigned url로 반환
        String profile = null;
        if(user.getProfile() != null) profile = fileService.getDownloadSignedURL(user.getProfile());
        log.info(profile);
        return UserInfoDto.builder()
                .userId(user.getId())
                .name(user.getName())
                .profileUrl(profile)
                .birth(user.getBirth())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}