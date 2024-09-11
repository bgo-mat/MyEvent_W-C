package com.example.event.event.repositories;

import com.example.event.event.entities.OutingParticipant;
import com.example.event.event.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutingParticipantRepository extends JpaRepository<OutingParticipant, Long> {
    List<OutingParticipant> findByOutingIdAndUserId(Long outingId, Long userId);
    List<OutingParticipant> findByOutingId(Long outingId);
    List<OutingParticipant> findAllByUser(User user);
}
