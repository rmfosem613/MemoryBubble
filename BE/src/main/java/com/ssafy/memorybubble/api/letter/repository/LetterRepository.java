package com.ssafy.memorybubble.api.letter.repository;

import com.ssafy.memorybubble.domain.Letter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LetterRepository extends JpaRepository<Letter, Long> {
    // List<Letter> findByReceiverId(Long receiverId);
    @Query("SELECT l from Letter l JOIN FETCH l.sender WHERE l.receiver.id = :receiverId ORDER BY l.createdAt")
    List<Letter> findByReceiverIdWithSender(@Param("receiverId") Long receiverId);
    boolean existsByReceiverIdAndIsReadFalse(Long receiverId);
}
