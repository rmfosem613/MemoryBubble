package com.ssafy.memorybubble.api.photo.service;

import com.ssafy.memorybubble.api.album.exception.AlbumException;
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
import com.ssafy.memorybubble.domain.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.ssafy.memorybubble.common.exception.ErrorCode.ALBUM_ACCESS_DENIED;
import static com.ssafy.memorybubble.common.exception.ErrorCode.PHOTO_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final FileService fileService;
    private final AlbumService albumService;
    private final UserService userService;
    private final ReviewRepository reviewRepository;

    @Transactional
    public List<FileResponse> addPhoto(Long userId, PhotoRequest photoRequest) {
        User user = userService.getUser(userId);

        // 앨범에 사진을 업로드
        Album album = albumService.getAlbum(photoRequest.getAlbumId());
        log.info("Add photo for user {} and album {}", userId, album);

        // 앨범에 접근할 수 있는지 확인
        validateAlbumAccess(user, album);

        return generateFileResponses(photoRequest.getPhotoLength(), album);
    }

    @Transactional
    public Object addReview(Long userId, Long photoId, ReviewRequest reviewRequest) {
        User user = userService.getUser(userId);

        Photo photo = photoRepository.findById(photoId).orElseThrow(() -> new PhotoException(PHOTO_NOT_FOUND));

        // 앨범에 접근할 수 있는지 확인
        validateAlbumAccess(user, photo.getAlbum());

        if (reviewRequest.getType().equals(Type.AUDIO)) {
            // 음성 메세지를 올릴 presigned 주소 생성
            String key = String.format("album/%d/review/%s", user.getFamily().getId(), UUID.randomUUID());
            String presignedUrl = fileService.getUploadPresignedUrl(key);

            saveReview(reviewRequest, photo, user, key);

            return FileResponse.builder()
                    .fileName(key)
                    .presignedUrl(presignedUrl)
                    .build();
        }
        else {
            saveReview(reviewRequest, photo, user, reviewRequest.getContent());
            return null;
        }
    }

    public List<ReviewDto> getPhotoReviews(Long userId, Long photoId) {
        User user = userService.getUser(userId);
        Photo photo = photoRepository.findById(photoId).orElseThrow(() -> new PhotoException(PHOTO_NOT_FOUND));

        // 앨범에 접근할 수 있는지 확인
        validateAlbumAccess(user, photo.getAlbum());

        List<Review> reviews = reviewRepository.findByPhotoId(photo.getId());
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private List<FileResponse> generateFileResponses(int photoLength, Album album) {
        List<FileResponse> fileResponses = new ArrayList<>();
        for(int i=0;i<photoLength;i++) {
            // 가족 id로 앨범 밑에 폴더를 만듦
            String key = String.format("album/%d/%s", album.getFamily().getId(), UUID.randomUUID());
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

    private void saveReview(ReviewRequest reviewRequest, Photo photo, User user, String content) {
        Review review = Review.builder()
                .photo(photo)
                .type(reviewRequest.getType())
                .content(content)
                .writer(user)
                .build();
        reviewRepository.save(review);
    }

    public ReviewDto convertToDto(Review review) {
        String content = review.getContent();

        // AUDIO인 경우 내용을 음성 파일 presigned url로 전달
        if(review.getType().equals(Type.AUDIO)) {
            String key = review.getContent();
            content = fileService.getDownloadPresignedURL(key);
        }

        return ReviewDto.builder()
                .type(review.getType())
                .content(content)
                .createdAt(review.getCreatedAt())
                .writer(review.getWriter().getName())
                .build();
    }
}