package com.example.event.event.controllers;

import com.example.event.event.dto.UpdateBioRequest;
import com.example.event.event.entities.User;
import com.example.event.event.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.example.event.event.services.UserService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/userinfo")
    public Map<String, String> getUserInfo(Authentication authentication) {
        return authService.getUserInfo(authentication);
    }


    @PostMapping("/discord")
    public Map<String, String> getDiscordInfo(Authentication authentication) {
        return authService.getDiscordInfo(authentication);
    }

    @GetMapping("/current-user")
    public Map<String, String> getCurrentUser(Authentication authentication) {
        return authService.getCurrentUserInfo(authentication);
    }

    @GetMapping("/logout")
    public Map<String, String> logout(HttpServletRequest request, Authentication authentication) {
        return authService.logoutUser(request, authentication);
    }

    @PutMapping("/update-bio")
    public String updateBio(@RequestBody UpdateBioRequest updateBioRequest, Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
            System.out.println("Diego");
            return authService.updateUserBio(updateBioRequest, oAuth2User);
        }
        return "Non authentifié.";
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestBody Map<String, String> requestBody, Authentication authentication) {
        try {
            if (authentication.getPrincipal() instanceof OAuth2User) {
                User currentUser = userService.getCurrentUser(authentication);
                String base64Image = requestBody.get("avatar");
                String avatarUrl = userService.uploadAvatarBase64(currentUser, base64Image);

                // Renvoie l'URL de l'avatar sous forme de JSON
                Map<String, String> response = new HashMap<>();
                response.put("avatarUrl", avatarUrl);

                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(401).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }




}
