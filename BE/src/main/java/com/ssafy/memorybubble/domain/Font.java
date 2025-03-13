package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Font {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "font_id")
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "font_name", nullable = false, length = 50)
    private String name;

    @Column(name = "font_name_eng", nullable = false, length = 50)
    private String nameEng;

    @Column(name = "font_path", nullable = false)
    private String path;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder
    public Font(User user, String name, String nameEng, String path, LocalDateTime createdAt) {
        this.user = user;
        this.name = name;
        this.nameEng = nameEng;
        this.path = path;
        this.createdAt = createdAt;
    }
}
