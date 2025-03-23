package com.ssafy.memorybubble.controller;

import com.ssafy.memorybubble.dto.ScheduleRequest;
import com.ssafy.memorybubble.exception.ErrorResponse;
import com.ssafy.memorybubble.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedules")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Schedule Controller", description = "일정 관련 Controller 입니다.")
public class ScheduleController {
    private final ScheduleService scheduleService;

    @PostMapping
    @Operation(
            summary = "일정 추가 API",
            description = "body에 일정 정보를 전달하고 일정을 생성합니다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "해당 가족에 가입되어 있지 않습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "앨범을 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "400", description = "잘못된 날짜입니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ResponseEntity<Void> addSchedule(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody ScheduleRequest scheduleRequest) {
        scheduleService.addSchedule(Long.valueOf(userDetails.getUsername()), scheduleRequest);
        return ResponseEntity.ok().build();
    }
}