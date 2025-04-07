package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Letter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "letter_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "letter_content", nullable = false, columnDefinition = "TEXT")
    @Lob
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDate openAt; // default: createdAt과 같음

    @ColumnDefault("false")
    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean isRead;

    @Column(length = 30)
    private String backgroundColor;

    public void updateIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    @Builder
    public Letter(User receiver, User sender, String content, Type type, LocalDateTime createdAt, LocalDate openAt, Boolean isRead, String backgroundColor) {
        this.receiver = receiver;
        this.sender = sender;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.openAt = openAt;
        this.isRead = isRead;
        this.backgroundColor = backgroundColor;
    }

    @PrePersist
    protected void onPersist() {
        if (this.openAt == null && this.createdAt != null) {
            this.openAt = this.createdAt.toLocalDate(); // openAt이 null 이면 createdAt과 동일해야 함
        }
    }
}
