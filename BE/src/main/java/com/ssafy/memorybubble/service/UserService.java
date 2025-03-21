package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import static com.ssafy.memorybubble.exception.ErrorCode.USER_NOT_FOUND;

import com.ssafy.memorybubble.dto.JoinRequest;
import com.ssafy.memorybubble.exception.UserException;
import com.ssafy.memorybubble.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
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

    @Transactional
    public void updateUser(User user, JoinRequest joinRequest, String profile) {
        // 이름, 프로필, 휴대폰번호, 성별, 생일 업데이트
        user.updateUser(joinRequest.getName(), profile, joinRequest.getPhoneNumber(),
                joinRequest.getGender(), joinRequest.getBirth());
    }
}