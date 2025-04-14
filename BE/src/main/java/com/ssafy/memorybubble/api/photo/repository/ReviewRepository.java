package com.ssafy.memorybubble.api.photo.repository;

import com.ssafy.memorybubble.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // List<Review> findByPhotoId(Long photoId);
    @Query("SELECT r FROM Review r JOIN FETCH r.writer WHERE r.photo.id = :photoId ORDER BY r.id")
    List<Review> findByPhotoIdWithWriter(@Param("photoId") Long photoId);
}
