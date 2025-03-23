package com.ssafy.memorybubble.api.user.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@SuperBuilder
@Getter
public class UserInfoDto {
    String name;
    String profileUrl;
    LocalDate birth;
    String phoneNumber;
}