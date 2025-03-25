package com.ssafy.memorybubble.api.user.dto;

import com.ssafy.memorybubble.domain.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@Getter
public class ProfileDto {
    String name;
    String profileUrl;
    LocalDate birth;
    String phoneNumber;
    private Gender gender;
    private Long familyId;
}