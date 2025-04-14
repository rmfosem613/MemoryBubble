package com.ssafy.memorybubble.api.photo.dto;

import com.ssafy.memorybubble.domain.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class ReviewDto {
    Type type;
    String content;
    LocalDateTime createdAt;
    String writer;
    Long writerId;
}
