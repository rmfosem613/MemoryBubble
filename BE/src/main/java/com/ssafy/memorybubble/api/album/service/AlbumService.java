package com.ssafy.memorybubble.api.album.service;

import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.api.album.dto.AlbumRequest;
import com.ssafy.memorybubble.api.album.exception.AlbumException;
import com.ssafy.memorybubble.api.family.exception.FamilyException;
import com.ssafy.memorybubble.api.album.repository.AlbumRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.ssafy.memorybubble.common.exception.ErrorCode.ALBUM_NOT_FOUND;
import static com.ssafy.memorybubble.common.exception.ErrorCode.FAMILY_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final UserService userService;

    // 가족 생성 후 기본 앨범 생성
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

    // 요청이 들어온 앨범 생성
    @Transactional
    public void addAlbum(Long userId, AlbumRequest albumRequest) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);
        Family family = user.getFamily();
        log.info("family: {}", family);

        // 요청을 한 user가 가입된 family가 없으면 예외 반환
        if(family == null) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }

        // 요청 한 user가 가입된 family와 albumRequest의 familyId가 일치하지 않으면 예외 반환
        if(!albumRequest.getFamilyId().equals(family.getId())) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }

        Album album = Album.builder()
                .family(family)
                .name(albumRequest.getAlbumName())
                .content(albumRequest.getAlbumContent())
                .backgroundColor(albumRequest.getBackgroundColor())
                .build();
        log.info("Add album: {}", album);
        albumRepository.save(album);
    }

    public Album getAlbum(Long id) {
        return albumRepository.findById(id).orElseThrow(()->new AlbumException(ALBUM_NOT_FOUND));
    }
}