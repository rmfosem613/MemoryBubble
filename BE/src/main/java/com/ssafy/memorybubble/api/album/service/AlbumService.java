package com.ssafy.memorybubble.api.album.service;

import com.ssafy.memorybubble.api.album.dto.AlbumDetailDto;
import com.ssafy.memorybubble.api.album.dto.AlbumDto;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.photo.dto.PhotoDto;
import com.ssafy.memorybubble.api.photo.repository.PhotoRepository;
import com.ssafy.memorybubble.common.util.Validator;
import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.Photo;
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
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.ssafy.memorybubble.common.exception.ErrorCode.ALBUM_NOT_FOUND;
import static com.ssafy.memorybubble.common.exception.ErrorCode.FAMILY_NOT_FOUND;

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

    public List<AlbumDto> getAlbums(Long userId, String name) {
        User user = userService.getUser(userId);
        Family family = user.getFamily();

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

    public Album getAlbum(Long id) {
        return albumRepository.findById(id).orElseThrow(()->new AlbumException(ALBUM_NOT_FOUND));
    }

    public AlbumDto convertToDto(Album album) {
        return AlbumDto.builder()
                .albumId(album.getId())
                .albumName(album.getName())
                .albumContent(album.getContent())
                .backgroundColor(album.getBackgroundColor())
                .thumbnailUrl(album.getThumbnail() == null ? null : fileService.getDownloadPresignedURL(album.getThumbnail()))
                .photoLength(photoRepository.countByAlbumId(album.getId()))
                .build();
    }

    public AlbumDetailDto convertToDto(Album album, List<Photo> photos) {
        // 앨범에 포함된 사진을 dto로 변환 후 앨범 dto로 변환
        List<PhotoDto> photoDtos = photos.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return AlbumDetailDto.builder()
                .albumName(album.getName())
                .photoList(photoDtos)
                .build();
    }

    public PhotoDto convertToDto(Photo photo) {
        // 사진을 dto로 변환
        String photoUrl = fileService.getDownloadPresignedURL(photo.getPath());

        return PhotoDto.builder()
                .photoId(photo.getId())
                .photoUrl(photoUrl)
                .build();
    }
}