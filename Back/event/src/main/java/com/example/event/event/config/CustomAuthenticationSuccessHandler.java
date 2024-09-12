package com.example.event.event.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String redirectUrl = determineRedirectUrl(authentication);

        response.sendRedirect(redirectUrl);
    }

    private String determineRedirectUrl(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

            String registrationId = oauthToken.getAuthorizedClientRegistrationId();

            if (registrationId.equals("google")) {
                return "http://51.75.162.147:4200/google-callback";
            }

            if (registrationId.equals("discord")) {
                return "http://51.75.162.147:4200/discord-callback";
            }
        }

        return "/";
    }
}
