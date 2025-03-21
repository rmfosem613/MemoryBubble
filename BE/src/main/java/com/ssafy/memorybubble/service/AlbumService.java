package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AlbumService {
    private final AlbumRepository albumRepository;

    @Transactional
    public void addAlbum(Family family, String name, String content, String backgroundColor, String thumbnail) {
        Album album = Album.builder()
                .family(family)
                .name(name)
                .content(content)
                .thumbnail(thumbnail)
                .backgroundColor(backgroundColor)
                .build();
        log.info("Add album: {}", album);
        albumRepository.save(album);
    }
}