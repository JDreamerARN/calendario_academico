package com.eventosacademicos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class EventRequest {
    
    @NotBlank(message = "Título é obrigatório")
    private String title;
    
    private String description;
    
    private List<String> tags;
    
    private String color;
    
    @NotNull(message = "Data é obrigatória")
    private LocalDateTime date;
    
    private List<Long> memberIds;
    
    public EventRequest() {}
    
    public EventRequest(String title, String description, List<String> tags, LocalDateTime date, List<Long> memberIds) {
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.date = date;
        this.memberIds = memberIds;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    public List<Long> getMemberIds() {
        return memberIds;
    }
    
    public void setMemberIds(List<Long> memberIds) {
        this.memberIds = memberIds;
    }

    @Override
    public String toString() {
        return "EventRequest{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", tags=" + tags +
                ", color=" + color +
                ", date=" + date +
                ", memberIds=" + memberIds +
                '}';
    }
}
