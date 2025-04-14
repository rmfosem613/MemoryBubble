package com.ssafy.memorybubble.api.family.dto;

import com.ssafy.memorybubble.domain.FontStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FamilyFontDto {
    private Long userId;
    private String userName;
    private String fontName;
    private String fileName;
    private FontStatus status;
}
