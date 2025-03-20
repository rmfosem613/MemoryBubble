package com.ssafy.memorybubble.repository;

import com.ssafy.memorybubble.domain.Family;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamilyRepository extends JpaRepository<Family,Long> {


}