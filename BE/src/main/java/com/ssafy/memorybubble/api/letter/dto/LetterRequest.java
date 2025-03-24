package com.ssafy.memorybubble.api.letter.dto;

import com.ssafy.memorybubble.domain.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class LetterRequest {
    Type type;
    String content;
    LocalDate openAt;
    String backgroundColor;
    Long receiverId;
}