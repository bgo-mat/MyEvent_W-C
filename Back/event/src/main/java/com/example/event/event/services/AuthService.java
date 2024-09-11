package com.example.event.event.services;

import com.example.event.event.dto.UpdateBioRequest;
import com.example.event.event.entities.User;
import com.example.event.event.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, String> getUserInfo(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            String googleId = oAuth2User.getAttribute("sub");
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            Optional<User> existingUser = userRepository.findByGoogleId(googleId);

            User user;
            if (existingUser.isEmpty()) {
                user = new User(email, name, googleId, null, null, "");
                userRepository.save(user);
            } else {
                user = existingUser.get();
            }

            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("id", googleId);
            userInfo.put("username", name);
            userInfo.put("email", email);
            userInfo.put("bio", user.getBio() != null ? user.getBio() : "");

            return userInfo;
        }

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Utilisateur non authentifié via Google.");
        return errorResponse;
    }


    public Map<String, String> getDiscordInfo(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            String discordId = oAuth2User.getAttribute("id");
            String username = oAuth2User.getAttribute("username");
            String email = oAuth2User.getAttribute("email");

            Optional<User> existingUser = userRepository.findByDiscordId(discordId);

            User user;
            if (existingUser.isEmpty()) {
                user = new User(email, username, null, discordId, username, "");
                userRepository.save(user);
            } else {
                user = existingUser.get();
            }

            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("id", discordId);
            userInfo.put("username", username);
            userInfo.put("email", email);
            userInfo.put("bio", user.getBio() != null ? user.getBio() : "");

            return userInfo;
        }

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Utilisateur non authentifié via Discord.");
        return errorResponse;
    }


    public Map<String, String> getCurrentUserInfo(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            // Vérifier si l'utilisateur est connecté via Google
            String googleId = oAuth2User.getAttribute("sub");
            if (googleId != null) {
                Optional<User> userOptional = userRepository.findByGoogleId(googleId);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    Map<String, String> userInfo = new HashMap<>();
                    userInfo.put("id", googleId);
                    userInfo.put("username", name);
                    userInfo.put("email", email);
                    userInfo.put("provider", "Google");
                    userInfo.put("bio", user.getBio() != null ? user.getBio() : "");

                    return userInfo;
                }
            }

            // Vérifier si l'utilisateur est connecté via Discord
            String discordId = oAuth2User.getAttribute("id");
            if (discordId != null) {
                Optional<User> userOptional = userRepository.findByDiscordId(discordId);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    Map<String, String> userInfo = new HashMap<>();
                    userInfo.put("id", discordId);
                    userInfo.put("username", oAuth2User.getAttribute("username"));
                    userInfo.put("email", email);
                    userInfo.put("provider", "Discord");
                    userInfo.put("bio", user.getBio() != null ? user.getBio() : "");

                    return userInfo;
                }
            }
        }

        // Si l'utilisateur n'est pas authentifié, retourner une erreur
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Utilisateur non authentifié.");
        return errorResponse;
    }

    public Map<String, String> logoutUser(HttpServletRequest request, Authentication authentication) {
        Map<String, String> result = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            try {
                request.logout();
                result.put("message", "Déconnexion réussie.");
                result.put("status", "success");
            } catch (ServletException e) {
                result.put("message", "Erreur lors de la déconnexion.");
                result.put("status", "error");
            }
        } else {
            result.put("message", "Aucun utilisateur connecté.");
            result.put("status", "error");
        }

        return result;
    }

    public String updateUserBio(UpdateBioRequest updateBioRequest, OAuth2User oAuth2User) {
        String googleId = oAuth2User.getAttribute("sub");
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setBio(updateBioRequest.getBio());
            userRepository.save(user);
            return "Bio mise à jour avec succès !";
        } else {
            return "Utilisateur non trouvé.";
        }
    }

}

