package com.ssafy.memorybubble.api.schedule.repository;

import com.ssafy.memorybubble.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {

    @Query("SELECT s from Schedule s WHERE s.family.id = :familyId AND s.startDate <= :end AND s.endDate >= :start")
    List<Schedule> findSchedules(@Param("familyId") Long familyId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}