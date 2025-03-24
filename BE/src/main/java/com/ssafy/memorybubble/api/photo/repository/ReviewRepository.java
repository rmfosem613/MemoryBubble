package com.ssafy.memorybubble.api.photo.repository;


import com.ssafy.memorybubble.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
