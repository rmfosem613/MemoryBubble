package com.ssafy.memorybubble.api.schedule.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class ScheduleRequest {
    @NotNull Long familyId;
    LocalDate startDate;
    LocalDate endDate;
    String content;
    Long albumId;
}