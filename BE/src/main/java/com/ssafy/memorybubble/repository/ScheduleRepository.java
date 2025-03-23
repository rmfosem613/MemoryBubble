package com.ssafy.memorybubble.repository;

import com.ssafy.memorybubble.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {

}