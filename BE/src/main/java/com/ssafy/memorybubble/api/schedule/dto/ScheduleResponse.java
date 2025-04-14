package com.ssafy.memorybubble.api.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@Getter
public class ScheduleResponse {
    Long scheduleId;
    String scheduleContent;
    LocalDate startDate;
    LocalDate endDate;
    Long albumId;
}