package com.ssafy.memorybubble.dto;

import com.ssafy.memorybubble.domain.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class JoinRequest {
    Long familyId;
    LocalDate birth;
    String name;
    String phoneNumber;
    Gender gender;
}