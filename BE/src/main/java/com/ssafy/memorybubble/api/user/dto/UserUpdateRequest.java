package com.ssafy.memorybubble.api.user.dto;

import com.ssafy.memorybubble.domain.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@Getter
public class UserUpdateRequest {
    LocalDate birth;
    Gender gender;
    String name;
    String phoneNumber;
    Boolean isProfileUpdate;
}