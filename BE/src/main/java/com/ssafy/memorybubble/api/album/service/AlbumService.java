package com.ssafy.memorybubble.api.album.service;

import com.ssafy.memorybubble.api.album.dto.*;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.photo.dto.PhotoDto;
import com.ssafy.memorybubble.api.photo.exception.PhotoException;
import com.ssafy.memorybubble.api.photo.repository.PhotoRepository;
import com.ssafy.memorybubble.common.util.Validator;
import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.Photo;
import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.api.album.exception.AlbumException;
import com.ssafy.memorybubble.api.album.repository.AlbumRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

import static com.ssafy.memorybubble.common.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final PhotoRepository photoRepository;
    private final UserService userService;
    private final FileService fileService;

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
    public void addAlbum(Long userId, AlbumRequest request) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);
        Family family = Validator.validateAndGetFamily(user, request.getFamilyId());
        log.info("family: {}", family);

        Album album = Album.builder()
                .family(family)
                .name(request.getAlbumName())
                .content(request.getAlbumContent())
                .backgroundColor(request.getBackgroundColor())
                .build();
        log.info("Add album: {}", album);
        albumRepository.save(album);
    }

    public List<AlbumDto> getAlbums(Long userId, String name) {
        User user = userService.getUser(userId);
        Family family = Validator.validateAndGetFamily(user);

        // name이 없거나 빈 문자열이면 family로 album을 찾고 name이 있으면 포함된 album 찾음
        List<Album> albums = StringUtils.hasText(name)
                ? albumRepository.findByFamilyAndNameContaining(family, name)
                : albumRepository.findByFamily(family);

        return albums.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AlbumDetailDto getAlbumDetail(Long userId, Long albumId) {
        User user = userService.getUser(userId);
        Album album = getAlbum(albumId);

        // 사용자가 접근할 수 있는 앨범인지 확인
        Validator.validateAlbumAccess(user, album);

        // 앨범에 포함된 사진 목록
        List<Photo> photos = photoRepository.findByAlbumId(album.getId());

        // 앨범과 앨범에 포함된 사진 dto로 변환 후 반환
        return convertToDto(album, photos);
    }

    @Transactional
    public void updateAlbumThumbnail(Long userId, Long albumId, Long photoId) {
        User user = userService.getUser(userId);
        Album album = getAlbum(albumId);

        // 사용자가 접근할 수 있는 앨범인지 확인
        Validator.validateAlbumAccess(user, album);

        // 썸네일을 변경 하려는 사진 id
        Photo photo = photoRepository.findById(photoId).orElseThrow(()->new PhotoException(PHOTO_NOT_FOUND));

        // 앨범에 포함되어 있지 않은 사진인 경우 예외 발생
        if (!photo.getAlbum().equals(album)) {
            throw(new PhotoException(PHOTO_ALBUM_INVALID));
        }

        album.updateThumbnail(photo.getPath());
        log.info("update album thumbnail: {}", album.getThumbnail());
    }

    @Transactional
    public AlbumUpdateResponse updateAlbum(Long userId, Long albumId, AlbumUpdateRequest request) {
        User user = userService.getUser(userId);
        Album album = getAlbum(albumId);

        // 사용자가 접근할 수 있는 앨범인지 확인
        Validator.validateAlbumAccess(user, album);

        // 이름이 있으면 이름 업데이트
        if (StringUtils.hasText(request.getAlbumName())) {
            album.updateName(request.getAlbumName());
            log.info("update album name: {}", album.getName());
        }

        // 내용이 있으면 내용 업데이트
        album.updateContent(request.getAlbumContent());
        log.info("update album content: {}", album.getContent());

        return AlbumUpdateResponse.builder()
                .albumName(album.getName())
                .albumContent(album.getContent())
                .build();
    }


    public Album getAlbum(Long id) {
        return albumRepository.findById(id).orElseThrow(()->new AlbumException(ALBUM_NOT_FOUND));
    }

    private AlbumDto convertToDto(Album album) {
        return AlbumDto.builder()
                .albumId(album.getId())
                .albumName(album.getName())
                .albumContent(album.getContent())
                .backgroundColor(album.getBackgroundColor())
                .thumbnailUrl(album.getThumbnail() == null ? null : fileService.getDownloadSignedURL(album.getThumbnail()))
                .photoLength(photoRepository.countByAlbumId(album.getId()))
                .build();
    }

    private AlbumDetailDto convertToDto(Album album, List<Photo> photos) {
        // 앨범에 포함된 사진을 dto로 변환 후 앨범 dto로 변환
        List<PhotoDto> photoDtos = photos.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return AlbumDetailDto.builder()
                .albumName(album.getName())
                .albumContent(album.getContent())
                .photoList(photoDtos)
                .build();
    }

    private PhotoDto convertToDto(Photo photo) {
        // 사진을 dto로 변환
        return PhotoDto.builder()
                .photoId(photo.getId())
                .photoUrl(fileService.getDownloadSignedURL(photo.getPath())+"&w=1000&h=1000")
                .build();
    }

    public boolean isBasicAlbum(Long albumId, Long familyId) {
        Album album = albumRepository.findFirstByFamilyIdOrderByCreatedAtAsc(familyId).orElseThrow(()->new AlbumException(ALBUM_NOT_FOUND));
        return album.getId().equals(albumId);
    }
}