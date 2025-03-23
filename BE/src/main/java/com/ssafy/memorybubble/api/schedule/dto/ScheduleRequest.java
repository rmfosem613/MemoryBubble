package com.ssafy.memorybubble.api.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class ScheduleRequest {
    Long familyId;
    LocalDate startDate;
    LocalDate endDate;
    String content;
    Long albumId;
}