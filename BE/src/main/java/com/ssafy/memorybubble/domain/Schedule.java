package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
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
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    public void update(LocalDate startDate, LocalDate endDate, String content, Album album) {
        if (startDate != null) this.startDate = startDate;
        if (endDate != null) this.endDate = endDate;
        if (content != null) this.content = content;
        this.album = album; // album이 null이면 기존 연결을 해제
    }

    @Builder
    public Schedule(Family family, Album album, String content, LocalDateTime createdAt, LocalDate startDate, LocalDate endDate) {
        this.family = family;
        this.album = album;
        this.content = content;
        this.createdAt = createdAt;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
