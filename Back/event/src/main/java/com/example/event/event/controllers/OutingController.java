package com.example.event.event.controllers;

import com.example.event.event.entities.Outing;
import com.example.event.event.entities.User;
import com.example.event.event.services.OutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.example.event.event.repositories.UserRepository;

import java.util.*;

@RestController
@RequestMapping("/outing")
public class OutingController {

    @Autowired
    private final OutingService outingService;

    @Autowired
    private final UserRepository userRepository;

    public OutingController(OutingService outingService, UserRepository userRepository) {
        this.outingService = outingService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create")
    public Outing createOuting(@RequestBody Map<String, String> outingData, Authentication authentication) {
        Long eventExternalId = Long.parseLong(outingData.get("eventExternalId"));
        String title = outingData.get("title");
        String visibility = outingData.get("visibility");

        // Appeler le service pour créer la sortie
        return outingService.createOuting(eventExternalId, title, visibility, authentication);
    }

    @GetMapping("/event/{eventExternalId}")
    public ResponseEntity<List<Outing>> getOutingsByEventExternalId(@PathVariable Long eventExternalId) {
        List<Outing> outings = outingService.getOutingsByEventExternalId(eventExternalId);
        if (outings.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(outings, HttpStatus.OK);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Map<String, String>> joinOuting(@PathVariable Long id, @AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "L'utilisateur n'est pas connecté.");
            return ResponseEntity.badRequest().body(response);
        }

        outingService.addParticipantToOuting(id, oauth2User);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur ajouté à la sortie avec succès !");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<User>> getParticipantsByOutingId(@PathVariable Long id) {
        List<User> participants = outingService.getParticipantsByOutingId(id);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/user-joined")
    public ResponseEntity<List<Outing>> getOutingsForCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            String userId = oAuth2User.getAttribute("sub"); // ou "id" pour Discord
            Optional<User> user = userRepository.findByGoogleId(userId);

            if (user.isPresent()) {
                List<Outing> outings = outingService.getOutingsForUser(user.get());
                return ResponseEntity.ok(outings);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @PostMapping("/{id}/generate-invite")
    public ResponseEntity<Map<String, String>> generateInviteLink(@PathVariable Long id, Authentication authentication) {
        String inviteLink = outingService.generateInviteLink(id, authentication);
        Map<String, String> response = new HashMap<>();
        response.put("inviteLink", inviteLink);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/join/{inviteLink}")
    public ResponseEntity<Map<String, Object>> joinOutingByInviteLink(@PathVariable String inviteLink, @AuthenticationPrincipal OAuth2User currentUser) {
        Outing outing = outingService.joinOutingByInviteLink(inviteLink, currentUser);

        Map<String, Object> response = new HashMap<>();
        response.put("roomId", outing.getId());
        response.put("eventUid", outing.getEventExternalId());

        return ResponseEntity.ok(response);
    }
}


