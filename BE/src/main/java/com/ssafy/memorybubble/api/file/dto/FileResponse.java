package com.ssafy.memorybubble.api.file.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class FileResponse {
    String presignedUrl;
    String fileName;
}