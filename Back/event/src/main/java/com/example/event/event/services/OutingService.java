package com.example.event.event.services;

import com.example.event.event.entities.Outing;
import com.example.event.event.entities.OutingParticipant;
import com.example.event.event.entities.User;
import com.example.event.event.repositories.OutingParticipantRepository;
import com.example.event.event.repositories.OutingRepository;
import com.example.event.event.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OutingService {

    private final OutingRepository outingRepository;
    private final UserRepository userRepository;
    private final OutingParticipantRepository outingParticipantRepository;

    @Autowired
    public OutingService(OutingRepository outingRepository, UserRepository userRepository, OutingParticipantRepository outingParticipantRepository) {
        this.outingRepository = outingRepository;
        this.userRepository = userRepository;
        this.outingParticipantRepository = outingParticipantRepository;
    }

    public Outing createOuting(Long eventExternalId, String title, String visibility, Authentication authentication) {
        String providerId = authentication.getName();

        Optional<User> organizerOpt = userRepository.findByGoogleId(providerId);

        if (!organizerOpt.isPresent()) {
            organizerOpt = userRepository.findByDiscordId(providerId);
        }

        User organizer = organizerOpt.orElseThrow(() -> new IllegalArgumentException("L'utilisateur organisateur est introuvable."));

        Outing outing = new Outing();
        outing.setEventExternalId(eventExternalId);
        outing.setTitle(title);
        outing.setOrganizer(organizer);
        outing.setVisibility(Outing.Visibility.valueOf(visibility));

        return outingRepository.save(outing);
    }

    public List<Outing> getOutingsByEventExternalId(Long eventExternalId) {
        return outingRepository.findByEventExternalId(eventExternalId);
    }

    public void addParticipantToOuting(Long outingId, OAuth2User oauth2User) {
        User currentUser = findUserFromOAuth2(oauth2User);

        if (isUserAlreadyParticipant(outingId, currentUser)) {
            throw new RuntimeException("Utilisateur est déjà participant de cette sortie.");
        }

        Outing outing = outingRepository.findById(outingId)
                .orElseThrow(() -> new RuntimeException("Sortie non trouvée"));

        OutingParticipant outingParticipant = new OutingParticipant(outing, currentUser);

        outingParticipantRepository.save(outingParticipant);
    }

    private boolean isUserAlreadyParticipant(Long outingId, User user) {
        List<OutingParticipant> existingParticipants = outingParticipantRepository.findByOutingIdAndUserId(outingId, user.getId());
        return !existingParticipants.isEmpty();
    }

    private User findUserFromOAuth2(OAuth2User oauth2User) {
        String providerId = oauth2User.getAttribute("sub");

        Optional<User> userOpt = userRepository.findByGoogleId(providerId);
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByDiscordId(providerId);
        }

        return userOpt.orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec cet ID"));
    }

    public List<User> getParticipantsByOutingId(Long outingId) {
        List<OutingParticipant> outingParticipants = outingParticipantRepository.findByOutingId(outingId);
        return outingParticipants.stream()
                .map(OutingParticipant::getUser)
                .collect(Collectors.toList());
    }

    public List<Outing> getOutingsForUser(User user) {
        return outingParticipantRepository.findAllByUser(user)
                .stream()
                .map(OutingParticipant::getOuting)
                .collect(Collectors.toList());
    }
}
