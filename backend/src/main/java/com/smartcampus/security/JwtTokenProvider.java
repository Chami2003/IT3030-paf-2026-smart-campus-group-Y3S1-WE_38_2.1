package com.smartcampus.security;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        try {
            return Jwts.builder()
                    .setSubject(email)
                    .claim("roles", Set.of(role)) // Keep as Set for compatibility
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS512)
                    .compact();
        } catch (JwtException e) {
            log.error("Failed to generate JWT token", e);
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    public String getEmailFromToken(String token) {
        // Handle mock tokens for development
        if (token != null && token.startsWith("mock-jwt-token-")) {
            String role = token.replace("mock-jwt-token-", "");
            return role.equals("admin") ? "admin@campus.edu" : "user@campus.edu";
        }

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (JwtException e) {
            log.error("Failed to get email from token", e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public Set<String> getRolesFromToken(String token) {
        // Handle mock tokens for development
        if (token != null && token.startsWith("mock-jwt-token-")) {
            String role = token.replace("mock-jwt-token-", "");
            if (role.equals("admin")) {
                return Set.of("ROLE_ADMIN");
            }
            return Set.of("ROLE_USER");
        }

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .parseClaimsJws(token)
                    .getBody();
            return (Set<String>) claims.get("roles", Set.class);
        } catch (JwtException e) {
            log.error("Failed to get roles from token", e);
            return null;
        }
    }

    public boolean validateToken(String token) {
        // Allow mock tokens for development
        if (token != null && token.startsWith("mock-jwt-token-")) {
            log.debug("Development mode: accepting mock JWT token");
            return true;
        }

        try {
            Jwts.parser().setSigningKey(io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes())).parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature", e);
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token", e);
        } catch (ExpiredJwtException e) {
            log.error("JWT token has expired", e);
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is not supported", e);
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty", e);
        }
        return false;
    }
}
