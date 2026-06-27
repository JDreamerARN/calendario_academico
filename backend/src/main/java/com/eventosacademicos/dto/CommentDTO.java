package com.eventosacademicos.dto;

import com.eventosacademicos.model.Comment;

import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;
    private String content;
    private UserSummaryDTO author;
    private LocalDateTime createdAt;
    
    public CommentDTO() {}
    
    public CommentDTO(Long id, String content, UserSummaryDTO author, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
    }
    
    public static CommentDTO fromEntity(Comment comment) {
        return new CommentDTO(
            comment.getId(),
            comment.getContent(),
            new UserSummaryDTO(comment.getAuthor().getId(), comment.getAuthor().getUsername()),
            comment.getCreatedAt()
        );
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public UserSummaryDTO getAuthor() { return author; }
    public void setAuthor(UserSummaryDTO author) { this.author = author; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public static class UserSummaryDTO {
        private Long id;
        private String username;
        
        public UserSummaryDTO() {}
        
        public UserSummaryDTO(Long id, String username) {
            this.id = id;
            this.username = username;
        }
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }
}
