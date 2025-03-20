package com.ssafy.memorybubble.repository;

import com.ssafy.memorybubble.domain.Album;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Long> {

}