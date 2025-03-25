package com.ssafy.memorybubble.api.user.controller;

import com.ssafy.memorybubble.api.user.dto.ProfileDto;
import com.ssafy.memorybubble.api.user.exception.UserException;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.common.exception.ErrorResponse;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.ssafy.memorybubble.common.exception.ErrorCode.USER_ACCESS_DENIED;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "User Controller", description = "사용자 관련 Controller 입니다.")
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}")
    @Operation(
            summary = "프로필 조회 API",
            description = "사용자의 id로 프로필을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "다른 사용자의 프로필은 볼 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    public ResponseEntity<ProfileDto> getProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                 @PathVariable Long userId) {
        // 자신이 아닌 다른 사람의 프로필을 보려고 할 때 예외 처리
        if(!userDetails.getUsername().equals(userId.toString())) {
            throw new UserException(USER_ACCESS_DENIED);
        }
        return ResponseEntity.ok(userService.getUserProfile(Long.valueOf(userDetails.getUsername())));
    }
}