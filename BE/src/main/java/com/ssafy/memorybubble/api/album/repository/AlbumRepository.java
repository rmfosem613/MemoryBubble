package com.ssafy.memorybubble.api.album.repository;

import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    @Query("SELECT a FROM Album a WHERE a.family = :family AND a.name LIKE %:name%")
    List<Album> findByFamilyAndNameContaining(@Param("family") Family family, @Param("name") String name);

    List<Album> findByFamily(Family family);
    Optional<Album> findFirstByFamilyIdOrderByCreatedAtAsc(Long familyId);
}