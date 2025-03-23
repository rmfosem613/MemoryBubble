package com.ssafy.memorybubble.api.user.dto;

import com.ssafy.memorybubble.domain.Gender;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class UserResponse extends UserInfoDto {
    Gender gender;
    Long familyId;
}