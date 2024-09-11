package com.example.event.event.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "outing_participants")
public class OutingParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "outing_id", nullable = false)
    private Outing outing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public OutingParticipant() {}

    public OutingParticipant(Outing outing, User user) {
        this.outing = outing;
        this.user = user;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Outing getOuting() {
        return outing;
    }

    public void setOuting(Outing outing) {
        this.outing = outing;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
