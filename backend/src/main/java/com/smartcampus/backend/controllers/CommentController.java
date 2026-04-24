package com.smartcampus.backend.controllers;

import com.smartcampus.backend.models.Comment;
import com.smartcampus.backend.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tickets")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get comments for a ticket
    @GetMapping("/{ticketId}/comments")
    public List<Comment> getComments(@PathVariable Long ticketId) {
        return commentService.getCommentsByTicketId(ticketId);
    }

    // Add a comment to a ticket
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long ticketId, @Valid @RequestBody Comment comment) {
        comment.setTicketId(ticketId);
        Comment createdComment = commentService.addComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    // Update a comment
    @PutMapping("/comments/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long id, 
            @Valid @RequestBody Comment comment,
            @RequestParam String currentUser) {
        Comment updatedComment = commentService.updateComment(id, comment, currentUser);
        return ResponseEntity.ok(updatedComment);
    }

    // Delete a comment
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestParam String currentUser,
            @RequestParam String currentRole) {
        commentService.deleteComment(id, currentUser, currentRole);
        return ResponseEntity.noContent().build();
    }
}
