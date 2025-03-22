package com.ssafy.memorybubble.dto;

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