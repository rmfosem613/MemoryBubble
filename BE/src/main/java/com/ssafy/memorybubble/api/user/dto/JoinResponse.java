package com.ssafy.memorybubble.api.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class JoinResponse {
    Boolean isJoinAvailable;
}