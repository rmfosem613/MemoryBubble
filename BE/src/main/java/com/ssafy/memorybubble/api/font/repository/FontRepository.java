package com.ssafy.memorybubble.api.font.repository;

import com.ssafy.memorybubble.domain.Font;
import com.ssafy.memorybubble.domain.FontStatus;
import com.ssafy.memorybubble.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FontRepository extends JpaRepository<Font, Long> {

    Optional<Font> findByUser(User user);

    List<Font> findAllByFontStatus(FontStatus status);
}
