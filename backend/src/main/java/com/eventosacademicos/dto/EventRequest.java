package com.eventosacademicos.dto;

import com.eventosacademicos.model.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class EventRequest {
    
    @NotBlank(message = "Título é obrigatório")
    private String title;
    
    private String description;
    
    @NotNull(message = "Tipo de evento é obrigatório")
    private EventType eventType;
    
    @NotNull(message = "Data é obrigatória")
    private LocalDateTime date;
    
    private List<Long> memberIds;
    
    // Construtores
    public EventRequest() {}
    
    public EventRequest(String title, String description, EventType eventType, LocalDateTime date, List<Long> memberIds) {
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.date = date;
        this.memberIds = memberIds;
    }
    
    // Getters e Setters
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
    
    public EventType getEventType() {
        return eventType;
    }
    
    public void setEventType(EventType eventType) {
        this.eventType = eventType;
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
} 