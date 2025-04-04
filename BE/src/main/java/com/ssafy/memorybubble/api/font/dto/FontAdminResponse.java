package com.ssafy.memorybubble.api.font.dto;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class FontAdminResponse {
    private Long fontId;
    private String userName;
    private String fontName;
    LocalDateTime createdAt;
    private List<FileResponse> files;
}
