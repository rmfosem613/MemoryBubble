package com.ssafy.memorybubble.api.auth.dto;

import lombok.*;

@Data
public class TokenRequest {
    String refreshToken;
}