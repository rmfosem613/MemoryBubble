package com.ssafy.memorybubble.api.letter.repository;

import com.ssafy.memorybubble.domain.Letter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LetterRepository extends JpaRepository<Letter, Long> {
    List<Letter> findByReceiverId(Long receiverId);
}
