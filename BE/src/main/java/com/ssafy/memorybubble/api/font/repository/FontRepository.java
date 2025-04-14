package com.ssafy.memorybubble.api.font.repository;

import com.ssafy.memorybubble.domain.Font;
import com.ssafy.memorybubble.domain.FontStatus;
import com.ssafy.memorybubble.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FontRepository extends JpaRepository<Font, Long> {

    Optional<Font> findByUser(User user);

    @Query("SELECT f FROM Font f JOIN FETCH f.user WHERE f.fontStatus = :status ORDER BY f.createdAt ASC")
    List<Font> findAllByFontStatus(@Param("status") FontStatus status);
}
