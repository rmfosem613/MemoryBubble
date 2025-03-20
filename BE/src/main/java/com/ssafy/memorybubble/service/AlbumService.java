package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;

    public void addAlbum(Family family, String name, String content, String backgroundColor, String thumbnail) {
        albumRepository.save(Album.builder()
                .family(family)
                .name(name)
                .content(content)
                .thumbnail(thumbnail)
                .backgroundColor(backgroundColor)
                .build()
        );
    }
}