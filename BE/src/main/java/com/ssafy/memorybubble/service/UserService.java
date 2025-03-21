package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import static com.ssafy.memorybubble.exception.ErrorCode.USER_NOT_FOUND;

import com.ssafy.memorybubble.dto.JoinRequest;
import com.ssafy.memorybubble.exception.UserException;
import com.ssafy.memorybubble.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUser (Long userId){
        return userRepository.findById(userId).orElseThrow(()->new UserException(USER_NOT_FOUND));
    }

    @Transactional
    public void updateUserFamily (User user, Family family) {
        // family가 생성되면 user에 family 추가
        user.updateUserFamily(family);
    }

    public Family getFamily(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
        return user.getFamily();
    }

    @Transactional
    public void updateUser(Long userId, JoinRequest joinRequest, String profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
        // 이름, 프로필, 휴대폰번호, 성별, 생일 업데이트
        user.updateUser(joinRequest.getName(), profile, joinRequest.getPhoneNumber(),
                joinRequest.getGender(), joinRequest.getBirth());
    }
}