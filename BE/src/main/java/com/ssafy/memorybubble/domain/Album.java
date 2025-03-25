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
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "album_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @Column(name = "album_name", nullable = false, length = 30)
    private String name;

    @Column(name = "album_content", nullable = false, length = 200)
    private String content;

    @Column(name = "album_thumbnail")
    private String thumbnail;

    @Column(nullable = false, length = 30)
    private String backgroundColor;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    public void updateThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public void updateName(String name) { this.name = name; }

    public void updateContent(String content) { this.content = content; }
    
    @Builder
    public Album(Family family, String name, String content, String thumbnail, String backgroundColor, LocalDateTime createdAt) {
        this.family = family;
        this.name = name;
        this.content = content;
        this.thumbnail = thumbnail;
        this.backgroundColor = backgroundColor;
        this.createdAt = createdAt;
    }
}
