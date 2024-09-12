package com.example.event.event.repositories;

import com.example.event.event.entities.Outing;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutingRepository extends JpaRepository<Outing, Long> {

    @EntityGraph(attributePaths = "organizer")
    List<Outing> findByEventExternalId(Long eventExternalId);

    Optional<Outing> findByInviteLink(String inviteLink);
}
