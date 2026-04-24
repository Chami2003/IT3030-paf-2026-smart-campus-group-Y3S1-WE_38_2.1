package com.smartcampus.entity;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String picture;
    
    @Column(unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean enabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt = System.currentTimeMillis();

    @Column(name = "updated_at")
    private Long updatedAt = System.currentTimeMillis();

    public User(String email, String name, String picture, String googleId) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.googleId = googleId;
        this.role = Role.USER;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }
}
