package com.ssafy.memorybubble.api.font.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class FontResponse {
    private Long fontId;
    private String fontName;
    private LocalDateTime createdAt;
    private String presignedUrl;
    private String fileName;
}
