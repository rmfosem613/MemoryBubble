package com.ssafy.memorybubble.api.family.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FamilyUpdateRequest {
    @NotBlank @Size(min = 1, max = 10, message = "그룹 이름은 1자 이상 10자 이하여야 합니다")
    String familyName;
    Boolean isThumbnailUpdate;
}