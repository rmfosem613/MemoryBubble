package com.ssafy.memorybubble.api.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@Getter
public class UserInfoDto {
    Long userId;
    String name;
    String profileUrl;
    LocalDate birth;
    String phoneNumber;
}