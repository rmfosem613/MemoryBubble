package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
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
    @CreatedDate
    private LocalDateTime createdAt;

    public void updateFamilyName(String name) {
        this.name = name;
    }

    public void updateFamilyNameAndThumbnail(String name, String thumbnail) {
        updateFamilyName(name);
        this.thumbnail = thumbnail;
    }

    @Builder
    public Family(String name, String thumbnail, LocalDateTime createdAt) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
    }
}
