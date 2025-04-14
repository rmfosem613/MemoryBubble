package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @Column(name = "photo_path", nullable = false)
    private String path;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    public void updateAlbum(Album album) {
        this.album = album;
    }

    @Builder
    public Photo(Album album, String path, LocalDateTime createdAt) {
        this.album = album;
        this.path = path;
        this.createdAt = createdAt;
    }
}
