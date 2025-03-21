package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import static com.ssafy.memorybubble.exception.ErrorCode.USER_NOT_FOUND;

import com.ssafy.memorybubble.dto.JoinRequest;
import com.ssafy.memorybubble.dto.UserInfoDto;
import com.ssafy.memorybubble.exception.UserException;
import com.ssafy.memorybubble.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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
        user.updateUserFamily(family);
    }

    @Transactional
    public void updateUser(User user, JoinRequest joinRequest, String profile) {
        // 이름, 프로필, 휴대폰번호, 성별, 생일 업데이트
        user.updateUser(joinRequest.getName(), profile, joinRequest.getPhoneNumber(),
                joinRequest.getGender(), joinRequest.getBirth());
    }

    public List<User> getUsersByFamilyId(Long familyId) {
        return userRepository.findByFamilyId(familyId);
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