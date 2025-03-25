package com.ssafy.memorybubble.api.photo.repository;

import com.ssafy.memorybubble.domain.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    int countByAlbumId(Long albumId);
    List<Photo> findByAlbumId(Long albumId);
}
