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
public class LetterDetailDto {
    String senderName;
    Long senderId;
    Type type;
    LocalDateTime createdAt;
    LocalDate openAt;
    String backgroundColor;
    String content;
    Long duration;
}