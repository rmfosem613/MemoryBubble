package com.ssafy.memorybubble.api.schedule.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LinkRequest {
    @NotNull
    Long albumId;
}
