package com.example.event.event.repositories;

import com.example.event.event.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByDiscordId(String discordId);
    User findByEmail(String email);
}
