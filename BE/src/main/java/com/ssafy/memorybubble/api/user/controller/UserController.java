package com.ssafy.memorybubble.api.user.controller;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.user.dto.*;
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
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/me")
    @Operation(
            summary = "사용자 조회 API",
            description = "사용자 id, 가족 id를 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserDto(Long.valueOf(userDetails.getUsername())));
    }

    @PatchMapping("/{userId}")
    @Operation(
            summary = "사용자 정보 수정 API",
            description = "사용자의 정보(생일, 성별, 이름, 휴대폰 번호)를 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "403", description = "다른 사용자의 프로필은 볼 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    public ResponseEntity<FileResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                      @PathVariable Long userId,
                                                      @RequestBody UserRequest userRequest) {
        if(!userDetails.getUsername().equals(userId.toString())) {
            throw new UserException(USER_ACCESS_DENIED);
        }
        return ResponseEntity.ok(userService.updateUser(Long.valueOf(userDetails.getUsername()), userRequest));
    }

    @GetMapping("/letter")
    @Operation(
            summary = "사용자가 읽지 않은 편지 존재 여부 반환 API",
            description = "읽지않은 편지가 있으면 true, 없으면 false를 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공(true/false)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    public ResponseEntity<UnreadLetterResponse> isUnreadLetter(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUnreadLetter(Long.valueOf(userDetails.getUsername())));
    }

    @GetMapping("/join")
    @Operation(
            summary = "사용자의 그룹 가입 가능 여부 반환 API",
            description = "그룹에 가입할 수 있으면 true, 없으면(이미 가입되어 있음) false를 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "요청 성공(true/false)"),
                    @ApiResponse(responseCode = "401", description = "토큰이 만료되었습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    public ResponseEntity<JoinResponse> isJoinAvailable(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getJoinAvailable(Long.valueOf(userDetails.getUsername())));
    }
}