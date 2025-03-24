package com.ssafy.memorybubble.api.photo.service;

import com.ssafy.memorybubble.api.album.exception.AlbumException;
import com.ssafy.memorybubble.api.album.service.AlbumService;
import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.photo.dto.PhotoRequest;
import com.ssafy.memorybubble.api.photo.repository.PhotoRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Photo;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.ssafy.memorybubble.common.exception.ErrorCode.ALBUM_ACCESS_DENIED;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final FileService fileService;
    private final AlbumService albumService;
    private final UserService userService;

    @Transactional
    public List<FileResponse> addPhoto(Long userId, PhotoRequest photoRequest) {
        User user = userService.getUser(userId);

        // 앨범에 사진을 업로드
        Album album = albumService.getAlbum(photoRequest.getAlbumId());
        log.info("Add photo for user {} and album {}", userId, album);

        // user가 album에 접근할 수 있는지
        validateAlbumAccess(user, album);

        return generateFileResponses(photoRequest.getPhotoLength(), album);
    }

    private List<FileResponse> generateFileResponses(int photoLength, Album album) {
        List<FileResponse> fileResponses = new ArrayList<>();
        for(int i=0;i<photoLength;i++) {
            String key = String.format("album/%d/%s", album.getId(), UUID.randomUUID());
            String presignedUrl = fileService.getUploadPresignedUrl(key);

            Photo photo = Photo.builder()
                    .album(album)
                    .path(key)
                    .build();
            photoRepository.save(photo);

            FileResponse fileResponse = FileResponse
                    .builder()
                    .fileName(key)
                    .presignedUrl(presignedUrl)
                    .build();
            fileResponses.add(fileResponse);
        }
        return fileResponses;
    }

    private void validateAlbumAccess(User user, Album album) {
        if (!album.getFamily().getId().equals(user.getFamily().getId())) {
            throw new AlbumException(ALBUM_ACCESS_DENIED);
        }
    }
}