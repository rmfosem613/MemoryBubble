package com.ssafy.memorybubble.api.photo.service;

import com.ssafy.memorybubble.api.album.dto.PhotoMoveRequest;
import com.ssafy.memorybubble.api.album.dto.PhotoMoveResponse;
import com.ssafy.memorybubble.api.album.service.AlbumService;
import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.photo.dto.PhotoRequest;
import com.ssafy.memorybubble.api.photo.dto.ReviewDto;
import com.ssafy.memorybubble.api.photo.dto.ReviewRequest;
import com.ssafy.memorybubble.api.photo.exception.PhotoException;
import com.ssafy.memorybubble.api.photo.repository.PhotoRepository;
import com.ssafy.memorybubble.api.photo.repository.ReviewRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.common.util.Validator;
import com.ssafy.memorybubble.domain.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.ssafy.memorybubble.common.exception.ErrorCode.PHOTO_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final ReviewRepository reviewRepository;
    private final FileService fileService;
    private final AlbumService albumService;
    private final UserService userService;

    // 사진 업로드
    @Transactional
    public List<FileResponse> addPhoto(Long userId, PhotoRequest request) {
        User user = userService.getUser(userId);

        // 앨범에 사진을 업로드
        Album album = albumService.getAlbum(request.getAlbumId());
        log.info("Add photo for user {} and album {}", userId, album);

        // 앨범에 접근할 수 있는지 확인
        Validator.validateAlbumAccess(user, album);

        return generateFileResponses(request.getPhotoLength(), album);
    }

    // 감상평 작성
    @Transactional
    public Object addReview(Long userId, Long photoId, ReviewRequest request) {
        User user = userService.getUser(userId);
        Photo photo = getPhoto(photoId);

        // 앨범에 접근할 수 있는지 확인
        Validator.validateAlbumAccess(user, photo.getAlbum());

        if (request.getType().equals(Type.AUDIO)) {
            // 음성 메세지를 올릴 presigned 주소 생성
            String key = String.format("album/%d/review/%s", user.getFamily().getId(), UUID.randomUUID());

            saveReview(request, photo, user, key);

            return fileService.createUploadFileResponse(key);
        }
        else {
            saveReview(request, photo, user, request.getContent());
            return null;
        }
    }

    // 사진(감상평) 조회
    public List<ReviewDto> getPhotoReviews(Long userId, Long photoId) {
        User user = userService.getUser(userId);
        Photo photo = getPhoto(photoId);

        // 앨범에 접근할 수 있는지 확인
        Validator.validateAlbumAccess(user, photo.getAlbum());

        List<Review> reviews = reviewRepository.findByPhotoIdWithWriter(photo.getId());
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 사진의 앨범 위치 변경
    @Transactional
    public PhotoMoveResponse movePhotos(Long userId, Long albumId, PhotoMoveRequest request) {
        User user = userService.getUser(userId);

        Album moveFromAlbum = albumService.getAlbum(albumId); // 기존 앨범
        // 기존 앨범에 유저가 접근할 수 있는지 확인
        Validator.validateAlbumAccess(user, moveFromAlbum);

        // 이동한 후 앨범의 사진 갯수가 0개면 썸네일 없앰
        if(photoRepository.countByAlbumId(moveFromAlbum.getId())-request.getPhotoList().size()==0) moveFromAlbum.updateThumbnail(null);
        // 기본 앨범인 경우 가족 이미지로 변경
        if(albumService.isBasicAlbum(albumId, moveFromAlbum.getFamily().getId())) {
            moveFromAlbum.updateThumbnail(moveFromAlbum.getFamily().getThumbnail());
        }

        Album moveToAlbum = albumService.getAlbum(request.getAlbumId()); // 이동하려는 앨범
        // 이동하려는 앨범에 유저가 접근할 수 있는지 확인
        Validator.validateAlbumAccess(user, moveToAlbum);

        List<Long> photos = request.getPhotoList();

        // 이동한 앨범이 비어있으면 옮기려는 사진의 가장 처음 사진을 썸네일로 업데이트
        if(photoRepository.countByAlbumId(moveToAlbum.getId()) == 0) moveToAlbum.updateThumbnail(getPhoto(photos.get(0)).getPath());
        for (Long photoId : photos) {
            Photo photo = getPhoto(photoId);
            // 앨범 id 업데이트
            photo.updateAlbum(moveToAlbum);
        }
        return PhotoMoveResponse.builder()
                .albumId(moveToAlbum.getId())
                .build();
    }

    private List<FileResponse> generateFileResponses(int photoLength, Album album) {
        List<FileResponse> fileResponses = new ArrayList<>();
        for(int i=0;i<photoLength;i++) {
            // 가족 id로 앨범 밑에 폴더를 만듦
            String key = String.format("album/%d/%s", album.getFamily().getId(), UUID.randomUUID());

            Photo photo = Photo.builder()
                    .album(album)
                    .path(key)
                    .build();
            photoRepository.save(photo);
            // 썸네일 없으면 업데이트
            if(album.getThumbnail() == null) album.updateThumbnail(key);
            fileResponses.add(fileService.createUploadFileResponse(key));
        }
        return fileResponses;
    }

    private void saveReview(ReviewRequest request, Photo photo, User user, String content) {
        Review review = Review.builder()
                .photo(photo)
                .type(request.getType())
                .content(content)
                .writer(user)
                .build();
        reviewRepository.save(review);
    }

    private ReviewDto convertToDto(Review review) {
        String content = review.getContent();

        // AUDIO인 경우 내용을 음성 파일 presigned url로 전달
        if(review.getType().equals(Type.AUDIO)) {
            String key = review.getContent();
            content = fileService.getDownloadSignedURL(key);
        }

        return ReviewDto.builder()
                .type(review.getType())
                .content(content)
                .createdAt(review.getCreatedAt())
                .writer(review.getWriter().getName())
                .writerId(review.getWriter().getId())
                .build();
    }

    public Photo getPhoto(Long photoId) {
        return photoRepository.findById(photoId).orElseThrow(() -> new PhotoException(PHOTO_NOT_FOUND));
    }
}