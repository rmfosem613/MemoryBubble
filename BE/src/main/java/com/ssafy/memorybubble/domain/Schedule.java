package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private Album album;

    @Column(name = "schedule_content", nullable = false, length = 180)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean isRepeat;

    @Builder
    public Schedule(Family family, String content, LocalDateTime createdAt, LocalDateTime startDate, LocalDateTime endDate, Boolean isRepeat) {
        this.family = family;
        this.content = content;
        this.createdAt = createdAt;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isRepeat = isRepeat;
    }
}
