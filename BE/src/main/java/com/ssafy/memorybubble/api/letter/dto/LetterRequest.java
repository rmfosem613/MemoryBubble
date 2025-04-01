package com.ssafy.memorybubble.api.letter.dto;

import com.ssafy.memorybubble.domain.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class LetterRequest {
    @NotNull Type type;
    String content;
    LocalDate openAt;
    @NotBlank String backgroundColor;
    @NotNull Long receiverId;
}