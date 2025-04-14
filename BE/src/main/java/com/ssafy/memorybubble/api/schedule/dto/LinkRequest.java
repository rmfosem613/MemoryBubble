package com.ssafy.memorybubble.api.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LinkRequest {
    Long albumId;
}
