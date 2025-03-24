package com.ssafy.memorybubble.api.letter.dto;

import com.ssafy.memorybubble.domain.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class LetterDto {
    Long letterId;
    String senderName;
    Type type;
    LocalDateTime createdAt;
    LocalDate openAt;
    String backgroundColor;
    Boolean isRead;
}