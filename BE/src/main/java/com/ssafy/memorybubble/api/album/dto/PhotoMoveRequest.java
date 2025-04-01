package com.ssafy.memorybubble.api.album.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter
public class PhotoMoveRequest {
    @NotBlank
    Long albumId;
    List<Long> photoList;
}