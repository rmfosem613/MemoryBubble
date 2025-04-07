package com.ssafy.memorybubble.api.album.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class AlbumUpdateResponse {
    String albumName;
    String albumContent;
}
