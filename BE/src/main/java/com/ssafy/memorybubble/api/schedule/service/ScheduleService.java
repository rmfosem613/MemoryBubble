package com.ssafy.memorybubble.api.schedule.service;

import com.ssafy.memorybubble.api.album.service.AlbumService;
import com.ssafy.memorybubble.api.schedule.dto.ScheduleResponse;
import com.ssafy.memorybubble.domain.Album;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.Schedule;
import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.api.schedule.dto.ScheduleRequest;
import com.ssafy.memorybubble.api.album.exception.AlbumException;
import com.ssafy.memorybubble.api.family.exception.FamilyException;
import com.ssafy.memorybubble.api.schedule.exception.ScheduleException;
import com.ssafy.memorybubble.api.schedule.repository.ScheduleRepository;
import com.ssafy.memorybubble.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import static com.ssafy.memorybubble.common.exception.ErrorCode.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserService userService;
    private final AlbumService albumService;

    @Transactional
    public ScheduleResponse addSchedule(Long userId, ScheduleRequest scheduleRequest) {
        log.info("schedule request: {}", scheduleRequest);

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

        return ScheduleResponse.builder()
                .scheduleId(schedule.getId())
                .scheduleContent(schedule.getContent())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .albumId(schedule.getAlbum() != null ? schedule.getAlbum().getId() : null)
                .build();
    }

    @Transactional
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

    @Transactional
    public ScheduleResponse updateSchedule(Long userId, Long scheduleId, ScheduleRequest scheduleRequest) {
        log.info("scheduleRequest: {}", scheduleRequest);

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

        // 날짜 검증 - 시작, 끝 날짜 모두 수정하는 경우
        if (scheduleRequest.getStartDate() != null && scheduleRequest.getEndDate() != null && scheduleRequest.getEndDate().isBefore(scheduleRequest.getStartDate())) {
            throw new ScheduleException(SCHEDULE_DATE_INVALID);
        }

        // 시작 날짜만 수정하는 경우 - 기존의 끝 날짜보다 늦으면 예외처리
        if (scheduleRequest.getStartDate() != null && scheduleRequest.getEndDate() == null && scheduleRequest.getStartDate().isAfter(schedule.getEndDate())){
            throw new ScheduleException(SCHEDULE_DATE_INVALID);
        }

        // 끝 날짜만 수정하는 경우 - 기존의 시작 날짜보다 이르면 예외 처리
        if(scheduleRequest.getStartDate() == null && scheduleRequest.getEndDate() != null && scheduleRequest.getEndDate().isBefore(schedule.getStartDate())){
            throw new ScheduleException(SCHEDULE_DATE_INVALID);
        }

        schedule.update(scheduleRequest.getStartDate(), scheduleRequest.getEndDate(), scheduleRequest.getContent());

        return ScheduleResponse.builder()
                .scheduleId(schedule.getId())
                .scheduleContent(schedule.getContent())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .albumId(schedule.getAlbum() != null ? schedule.getAlbum().getId() : null)
                .build();
    }

    @Transactional
    public ScheduleResponse linkSchedule(Long userId, Long scheduleId, Long albumId) {
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

        if(albumId == null) {
            schedule.update(null);
        } else {
            // 앨범 연결
            Album album = albumService.getAlbum(albumId);
            // user의 가족이 접근할 수 있는 앨범인지 확인
            if (!family.getId().equals(album.getFamily().getId())) {
                throw new AlbumException(ALBUM_ACCESS_DENIED);
            }
            schedule.update(album);
        }

        return ScheduleResponse.builder()
                .scheduleId(schedule.getId())
                .scheduleContent(schedule.getContent())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .albumId(schedule.getAlbum() != null ? schedule.getAlbum().getId() : null)
                .build();
    }

    public List<ScheduleResponse> getSchedules(Long userId, Long familyId, int year, int month) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);

        // user가 다른 그룹에 가입 되어있거나 가입되어 있지 않은 경우 예외 반환
        Family family = user.getFamily();
        if (family == null || !family.getId().equals(familyId)) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }
        log.info("family: {}", family);

        // 해당 월의 마지막 시작 날짜, 마지막 날짜 구함
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<Schedule> schedules = scheduleRepository.findSchedules(familyId, start, end);
        return schedules.stream()
                .map(this::convertToScheduleResponse)
                .toList();
    }

    public ScheduleResponse convertToScheduleResponse(Schedule schedule) {
        return ScheduleResponse.builder()
                .scheduleId(schedule.getId())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .scheduleContent(schedule.getContent())
                .albumId(schedule.getAlbum() != null ? schedule.getAlbum().getId() : null)
                .build();
    }
}