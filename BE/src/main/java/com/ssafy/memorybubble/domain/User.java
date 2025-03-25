package com.ssafy.memorybubble.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 40)
    private String name;

    private LocalDate birth;

    private String profile;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ColumnDefault("true")
    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean active;

    public void updateUserFamily(Family family) {
        this.family = family;
    }

    public void updateUser(String name, String profile, String phoneNumber, Gender gender, LocalDate birth) {
        if(StringUtils.hasText(name)) this.name = name;
        if(StringUtils.hasText(profile)) this.profile = profile;
        if(StringUtils.hasText(phoneNumber)) this.phoneNumber = phoneNumber;
        if(gender != null) this.gender = gender;
        if(birth != null) this.birth = birth;
    }

    @Builder
    public User(Family family, String email, String name, String profile, String phoneNumber, Gender gender, LocalDate birth, Boolean active) {
        this.family = family;
        this.email = email;
        this.name = name;
        this.profile = profile;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.birth = birth;
        this.active = active;
    }
}
