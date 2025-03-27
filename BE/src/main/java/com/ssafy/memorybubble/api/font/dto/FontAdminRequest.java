package com.ssafy.memorybubble.api.font.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FontAdminRequest {
    private Long userId;
}
