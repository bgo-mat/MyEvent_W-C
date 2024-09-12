package com.example.event.event.repositories;

import com.example.event.event.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByDiscordId(String discordId);
    User findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.googleId = :id OR u.discordId = :id")
    Optional<User> findByGoogleIdOrDiscordId(@Param("id") String id);
}
