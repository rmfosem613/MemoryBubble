package com.ssafy.memorybubble.api.album.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ThumbnailUpdateRequest {
    @NotNull
    Long photoId;
}