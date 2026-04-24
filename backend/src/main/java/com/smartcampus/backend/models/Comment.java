package com.smartcampus.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ticketId;

    @NotBlank(message = "Author name is required")
    private String authorName;

    private String authorRole;

    @NotBlank(message = "Content is required")
    @Column(length = 1000)
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Comment() {}

    public Comment(Long ticketId, String authorName, String authorRole, String content) {
        this.ticketId = ticketId;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.content = content;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
