package com.ssafy.memorybubble.api.schedule.repository;

import com.ssafy.memorybubble.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {

}