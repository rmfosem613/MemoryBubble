package com.ssafy.memorybubble.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class FamilyResponse {
    String familyName;
    String thumbnailUrl;
    List<UserInfoDto> familyMembers;
}
