package com.ssafy.memorybubble.api.photo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PhotoRequest {
    Long albumId;
    Integer photoLength;
}
