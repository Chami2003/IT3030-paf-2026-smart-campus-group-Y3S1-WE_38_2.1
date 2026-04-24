package com.smartcampus.dto;

import com.smartcampus.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {
    private String token;
    private String email;
    private String name;
    private String picture;
    private Set<Role> roles;
}
