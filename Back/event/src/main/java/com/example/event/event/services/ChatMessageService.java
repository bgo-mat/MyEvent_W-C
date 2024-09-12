package com.example.event.event.services;

import com.example.event.event.entities.ChatMessage;
import com.example.event.event.entities.Outing;
import com.example.event.event.repositories.ChatMessageRepository;
import com.example.event.event.repositories.OutingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private OutingRepository outingRepository;

    public ChatMessage saveMessage(String content, String sender, Long outingId, ChatMessage.MessageType type) {
        Outing outing = outingRepository.findById(outingId)
                .orElseThrow(() -> new RuntimeException("Sortie non trouvée"));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent(content);
        chatMessage.setSender(sender);
        chatMessage.setOuting(outing);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setType(type);

        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatMessagesForOuting(Long outingId) {
        Outing outing = outingRepository.findById(outingId)
                .orElseThrow(() -> new RuntimeException("Sortie non trouvée"));

        List<ChatMessage> messages = chatMessageRepository.findByOutingOrderByTimestampAsc(outing);
        System.out.println("Nombre de messages récupérés: " + messages.size());
        return messages;
    }

}

