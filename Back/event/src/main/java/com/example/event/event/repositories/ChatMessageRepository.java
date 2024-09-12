package com.example.event.event.repositories;

import com.example.event.event.entities.ChatMessage;
import com.example.event.event.entities.Outing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Récupérer tous les messages pour une sortie donnée, triés par date de création
   // List<ChatMessage> findByOutingAndTypeOrderByTimestampAsc(Outing outing, ChatMessage.MessageType type);
    List<ChatMessage> findByOutingOrderByTimestampAsc(Outing outing);
}
