package com.ssafy.memorybubble.api.family.dto;

import com.ssafy.memorybubble.domain.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class FamilyJoinRequest {
    @NotNull
    Long familyId;

    @NotNull
    LocalDate birth;

    @NotBlank
    String name;

    @NotBlank
    @Pattern(regexp = "^\\d{3}-\\d{4}-\\d{4}$", message = "올바르지 않은 전화번호 형식입니다.")
    String phoneNumber;

    @NotNull
    Gender gender;
}