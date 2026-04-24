package com.smartcampus.backend.services;

import com.smartcampus.backend.models.Comment;
import com.smartcampus.backend.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Comment updateComment(Long id, Comment updatedComment, String currentUser) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
            
        if (!comment.getAuthorName().equals(currentUser)) {
            throw new RuntimeException("Unauthorized to edit this comment");
        }
        
        comment.setContent(updatedComment.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id, String currentUser, String currentRole) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
            
        // Admin or the author can delete
        if (!comment.getAuthorName().equals(currentUser) && !"Admin".equals(currentRole)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }
        
        commentRepository.delete(comment);
    }
}
