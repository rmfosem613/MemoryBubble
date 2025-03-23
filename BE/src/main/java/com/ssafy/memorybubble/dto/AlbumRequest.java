package com.ssafy.memorybubble.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AlbumRequest {
    Long familyId;
    String albumName;
    String albumContent;
    String backgroundColor;
}