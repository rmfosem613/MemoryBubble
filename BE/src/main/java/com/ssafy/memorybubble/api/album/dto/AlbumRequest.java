package com.ssafy.memorybubble.api.album.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AlbumRequest {
    @NotNull
    Long familyId;

    @NotBlank
    @Size(min = 1, max = 7, message = "앨범 이름은 1자 이상 7자 이하여야 합니다")
    String albumName;

    @Size(max = 60, message = "앨범 내용은 60자 이하여야 합니다")
    String albumContent;

    @NotBlank
    String backgroundColor;
}