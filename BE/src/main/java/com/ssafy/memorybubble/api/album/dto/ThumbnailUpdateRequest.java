package com.ssafy.memorybubble.api.album.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ThumbnailUpdateRequest {
    @NotBlank
    Long photoId;
}