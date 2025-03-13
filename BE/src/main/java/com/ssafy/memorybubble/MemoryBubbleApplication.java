package com.ssafy.memorybubble;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MemoryBubbleApplication {

    public static void main(String[] args) {
        SpringApplication.run(MemoryBubbleApplication.class, args);
    }

}
