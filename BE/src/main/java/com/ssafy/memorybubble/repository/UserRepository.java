package com.ssafy.memorybubble.repository;

import com.ssafy.memorybubble.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    List<User> findByFamilyId(Long familyId);
}
