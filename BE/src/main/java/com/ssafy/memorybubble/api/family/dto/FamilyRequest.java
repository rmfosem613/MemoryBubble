package com.ssafy.memorybubble.api.family.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FamilyRequest {
    String familyName;
}