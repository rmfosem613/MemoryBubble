package com.ssafy.memorybubble.api.photo.repository;

import com.ssafy.memorybubble.domain.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    int countByAlbumId(Long albumId);
}
