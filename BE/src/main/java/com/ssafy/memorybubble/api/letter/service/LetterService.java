package com.ssafy.memorybubble.api.letter.service;

import com.ssafy.memorybubble.api.letter.repository.LetterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class LetterService {
    private final LetterRepository letterRepository;
}
