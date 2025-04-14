package com.ssafy.memorybubble.api.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
public class TokenRequest {
    @NotBlank String refreshToken;
}