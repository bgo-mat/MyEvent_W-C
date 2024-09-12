package com.example.event.event.services;

import com.example.event.event.entities.User;
import com.example.event.event.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "src/main/resources/uploads/avatars/";

    public String uploadAvatarBase64(User user, String base64Image) throws IOException {
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        String fileName = user.getId() + "_avatar.png";
        Path filePath = Paths.get(UPLOAD_DIR + fileName);

        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);

        String avatarUrl = "http://localhost:8080/avatars/" + fileName;
        user.setAvatar(avatarUrl);
        userRepository.save(user);

        return avatarUrl;
    }


    public User getCurrentUser(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            String userId = oAuth2User.getAttribute("sub");

            if (userId == null) {
                userId = oAuth2User.getAttribute("id");
            }

            if (userId != null) {
                return userRepository.findByGoogleIdOrDiscordId(userId)
                        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            } else {
                throw new RuntimeException("Impossible de déterminer l'ID de l'utilisateur.");
            }
        }
        throw new RuntimeException("Utilisateur non authentifié");
    }


}
