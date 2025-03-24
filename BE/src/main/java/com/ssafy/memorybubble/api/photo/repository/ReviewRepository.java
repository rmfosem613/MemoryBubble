package com.ssafy.memorybubble.api.photo.repository;

import com.ssafy.memorybubble.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPhotoId(Long photoId);
}
