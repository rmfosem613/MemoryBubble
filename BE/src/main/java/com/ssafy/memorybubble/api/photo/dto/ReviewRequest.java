package com.ssafy.memorybubble.api.photo.dto;

import com.ssafy.memorybubble.domain.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ReviewRequest {
    Type type;
    String content;
}