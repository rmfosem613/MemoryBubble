package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "family_id")
    private Long id;

    @Column(name = "family_name", nullable = false, length = 40)
    private String name;

    @Column(name = "family_thumbnail", nullable = false)
    private String thumbnail;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder
    public Family(String name, String thumbnail, LocalDateTime createdAt) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
    }
}
