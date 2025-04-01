package com.ssafy.memorybubble.api.album.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter
public class PhotoMoveRequest {
    @NotNull
    Long albumId;
    List<Long> photoList;
}