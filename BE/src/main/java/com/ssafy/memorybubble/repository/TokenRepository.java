package com.ssafy.memorybubble.repository;

import com.ssafy.memorybubble.security.dto.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends CrudRepository<RefreshToken,String> {
    // id로 refreshToken 찾음
    Optional<RefreshToken> findById(String id);

    // accessToken으로 refreshToken 찾음
    Optional<RefreshToken> findByAccessToken(String accessToken);

    // id로 삭제
    void deleteById(String id);
}
