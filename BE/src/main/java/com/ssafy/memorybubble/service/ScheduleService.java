package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.Schedule;
import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.dto.ScheduleRequest;
import com.ssafy.memorybubble.exception.AlbumException;
import com.ssafy.memorybubble.exception.FamilyException;
import com.ssafy.memorybubble.exception.ScheduleException;
import com.ssafy.memorybubble.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.ssafy.memorybubble.exception.ErrorCode.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserService userService;
    private final AlbumService albumService;

    public void addSchedule(Long userId, ScheduleRequest scheduleRequest) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);

        // user가 다른 그룹에 가입 되어있거나 가입되어 있지 않은 경우 예외 반환
        Family family = user.getFamily();
        if (family == null || !family.getId().equals(scheduleRequest.getFamilyId())) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }
        log.info("family: {}", family);

        // albumId가 있으면 album 찾음
        Album album = null;
        if (scheduleRequest.getAlbumId() != null) {
            album = albumService.getAlbum(scheduleRequest.getAlbumId());
            // 앨범의 family가 familyId와 다르면 예외 반환
            if (!family.getId().equals(album.getFamily().getId())) {
                throw new AlbumException(ALBUM_ACCESS_DENIED);
            }
        }

        // 날짜 검증
        if (scheduleRequest.getStartDate() == null || scheduleRequest.getEndDate() == null) {
            throw new ScheduleException(SCHEDULE_DATE_INVALID);
        }
        if (scheduleRequest.getEndDate().isBefore(scheduleRequest.getStartDate())) {
            throw new ScheduleException(SCHEDULE_DATE_INVALID);
        }

        Schedule schedule = Schedule.builder()
                .startDate(scheduleRequest.getStartDate())
                .endDate(scheduleRequest.getEndDate())
                .content(scheduleRequest.getContent())
                .family(family)
                .album(album)
                .build();

        scheduleRepository.save(schedule);
        log.info("schedule: {}", schedule);
    }

    public void deleteSchedule(Long userId, Long scheduleId) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);

        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new ScheduleException(SCHEDULE_NOT_FOUND));
        log.info("schedule: {}", schedule);

        // user가 다른 그룹에 가입 되어있거나 가입되어 있지 않은 경우 예외 반환
        Family family = user.getFamily();
        if (family == null || !family.getId().equals(schedule.getFamily().getId())) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }
        log.info("family: {}", family);

        scheduleRepository.delete(schedule);
    }
}