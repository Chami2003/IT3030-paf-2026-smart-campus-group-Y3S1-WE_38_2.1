package com.smartcampus.security;

import com.smartcampus.entity.Role;
import com.smartcampus.entity.User;
import com.smartcampus.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String googleId = oAuth2User.getName();

        log.info("OAuth2 login successful for email: {}", email);

        try {
            // Find or create user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User(email, name, picture, googleId);
                Set<Role> roles = new HashSet<>();
                roles.add(Role.USER);
                newUser.setRoles(roles);
                User savedUser = userRepository.save(newUser);
                log.info("New user created: {}", email);
                return savedUser;
            });

            // Generate JWT token
            String token = tokenProvider.generateToken(user.getEmail(),
                    user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));

            log.debug("JWT token generated for user: {}", email);

            // Redirect to frontend with token
            String redirectUrl = "http://localhost:3000/callback?token=" + token;
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            log.error("Error in OAuth2 success handler", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Authentication failed");
        }
    }
}
