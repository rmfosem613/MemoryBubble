package com.ssafy.memorybubble.api.photo.controller;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.photo.dto.PhotoRequest;
import com.ssafy.memorybubble.api.photo.service.PhotoService;
import com.ssafy.memorybubble.domain.Photo;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Photo Controller", description = "사진 관련 Controller 입니다.")
public class PhotoController {
    private final PhotoService photoService;

    @PostMapping
    public ResponseEntity<List<FileResponse>> addPhotos(@AuthenticationPrincipal UserDetails userDetails,
                                                        @RequestBody PhotoRequest photoRequest) {
        List<FileResponse> fileResponses = photoService.addPhoto(Long.valueOf(userDetails.getUsername()), photoRequest);
        return ResponseEntity.ok(fileResponses);
    }
}
