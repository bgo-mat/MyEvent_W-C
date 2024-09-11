package com.example.event.event.controllers;

import com.example.event.event.dto.UpdateBioRequest;
import com.example.event.event.services.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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

}
