package com.ssafy.memorybubble.api.user.dto;

import com.ssafy.memorybubble.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class UserDto {
    Long userId;
    Long familyId;
    Role role;
}
