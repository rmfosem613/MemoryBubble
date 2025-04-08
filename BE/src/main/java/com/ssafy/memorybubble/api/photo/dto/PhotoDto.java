package com.ssafy.memorybubble.api.photo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class PhotoDto {
    Long photoId;
    String photoUrl;
    Boolean isThumbnail;
}