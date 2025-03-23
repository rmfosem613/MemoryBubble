package com.ssafy.memorybubble.api.family.dto;

import com.ssafy.memorybubble.dto.UserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class FamilyInfoResponse {
    String familyName;
    String thumbnailUrl;
    List<UserInfoDto> familyMembers;
}