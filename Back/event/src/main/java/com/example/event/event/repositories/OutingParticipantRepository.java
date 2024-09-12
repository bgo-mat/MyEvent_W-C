package com.example.event.event.repositories;

import com.example.event.event.entities.Outing;
import com.example.event.event.entities.OutingParticipant;
import com.example.event.event.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutingParticipantRepository extends JpaRepository<OutingParticipant, Long> {
    List<OutingParticipant> findByOutingIdAndUserId(Long outingId, Long userId);
    List<OutingParticipant> findByOutingId(Long outingId);
    List<OutingParticipant> findAllByUser(User user);
    boolean existsByOutingAndUser(Outing outing, User user);
}
