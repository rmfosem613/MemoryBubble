package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import static com.ssafy.memorybubble.exception.ErrorCode.USER_NOT_FOUND;
import com.ssafy.memorybubble.exception.UserException;
import com.ssafy.memorybubble.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public boolean isFamilyExist(Long userId) {
        // user가 family를 가지고 있으면 true, 아니면 false return
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));

        return user.getFamily() != null;
    }

    @Transactional
    public void updateUserFamily (Long userId, Family family) {
        // family가 생성되면 user에 family 추가
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
        user.updateFamily(family);
    }

    public Family getFamily(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));

        return user.getFamily();
    }
}