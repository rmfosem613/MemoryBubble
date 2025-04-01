package com.ssafy.memorybubble.api.photo.dto;

import com.google.firebase.database.annotations.NotNull;
import com.ssafy.memorybubble.domain.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ReviewRequest {
    @NotNull
    Type type;
    String content; // AUDIO는 null
}