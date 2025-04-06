package com.ssafy.memorybubble.api.photo.dto;

import com.google.firebase.database.annotations.NotNull;
import com.ssafy.memorybubble.domain.Type;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ReviewRequest {
    @NotNull Type type;
    @Size(max = 40) String content; // AUDIO는 null
}