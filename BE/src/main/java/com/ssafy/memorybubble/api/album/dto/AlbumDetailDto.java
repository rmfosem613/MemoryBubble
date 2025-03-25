package com.ssafy.memorybubble.api.album.dto;

import com.ssafy.memorybubble.api.photo.dto.PhotoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter
public class AlbumDetailDto {
    String albumName;
    List<PhotoDto> photoList;
}
