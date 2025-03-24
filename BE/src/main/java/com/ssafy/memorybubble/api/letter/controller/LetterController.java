package com.ssafy.memorybubble.api.letter.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/letters")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Letter Controller", description = "편지 관련 Controller 입니다.")
public class LetterController {

}
