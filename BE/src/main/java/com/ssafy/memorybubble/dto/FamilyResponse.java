package com.ssafy.memorybubble.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class FamilyResponse {
    Long familyId;
    String presignedUrl;
    String fileName;
}