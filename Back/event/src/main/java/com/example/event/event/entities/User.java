package com.example.event.event.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String name;
    private String googleId;
    private String discordId;
    private String discordUsername;
    private String bio;
    private String avatar;

    // Constructeurs, getters et setters
    public User() {}

    public User(String email, String name, String googleId, String discordId, String discordUsername, String bio, String avatar) {
        this.email = email;
        this.name = name;
        this.googleId = googleId;
        this.discordId = discordId;
        this.discordUsername = discordUsername;
        this.bio = bio;
        this.avatar = avatar;
    }
    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getters et setters pour Google et Discord
    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getDiscordId() {
        return discordId;
    }

    public void setDiscordId(String discordId) {
        this.discordId = discordId;
    }

    public String getDiscordUsername() {
        return discordUsername;
    }

    public void setDiscordUsername(String discordUsername) {
        this.discordUsername = discordUsername;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Autres getters et setters (email, name, etc.)
}
