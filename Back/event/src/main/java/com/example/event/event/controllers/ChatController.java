package com.example.event.event.controllers;

import com.example.event.event.entities.ChatMessage;
import com.example.event.event.entities.Outing;
import com.example.event.event.services.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private ChatMessageService chatMessageService;

    @MessageMapping("/chat.sendMessage/{outingId}")
    @SendTo("/topic/{outingId}")
    public ChatMessage sendMessage(@DestinationVariable Long outingId, ChatMessage chatMessage) {
        // Sauvegarder le message dans la base de données avec le type CHAT
        chatMessageService.saveMessage(chatMessage.getContent(), chatMessage.getSender(), outingId, ChatMessage.MessageType.CHAT);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser/{outingId}")
    @SendTo("/topic/{outingId}")
    public ChatMessage addUser(@DestinationVariable Long outingId, ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Ajouter l'utilisateur à la session avec le type JOIN
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        chatMessageService.saveMessage(chatMessage.getSender() + " a rejoint la sortie.", chatMessage.getSender(), outingId, ChatMessage.MessageType.JOIN);
        return chatMessage;
    }

    @GetMapping("/messages/{outingId}")
    public ResponseEntity<List<ChatMessage>> getChatMessagesForOuting(@PathVariable Long outingId) {
        List<ChatMessage> messages = chatMessageService.getChatMessagesForOuting(outingId);
        return ResponseEntity.ok(messages);
    }
}

