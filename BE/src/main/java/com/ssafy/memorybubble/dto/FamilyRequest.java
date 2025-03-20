package com.ssafy.memorybubble.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FamilyRequest {
    String familyName;
}