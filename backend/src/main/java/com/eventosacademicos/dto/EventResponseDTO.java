package com.eventosacademicos.dto;

import com.eventosacademicos.model.EventType;
import java.time.LocalDateTime;
import java.util.List;

public class EventResponseDTO {
    private Long id;
    private String title;
    private String description;
    private EventType eventType;
    private LocalDateTime date;
    private EventMemberDTO.UserSummaryDTO organizer;
    private List<EventMemberDTO> members;

    public EventResponseDTO() {}

    public EventResponseDTO(Long id, String title, String description, EventType eventType, LocalDateTime date, EventMemberDTO.UserSummaryDTO organizer, List<EventMemberDTO> members) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.date = date;
        this.organizer = organizer;
        this.members = members;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public EventMemberDTO.UserSummaryDTO getOrganizer() { return organizer; }
    public void setOrganizer(EventMemberDTO.UserSummaryDTO organizer) { this.organizer = organizer; }
    public List<EventMemberDTO> getMembers() { return members; }
    public void setMembers(List<EventMemberDTO> members) { this.members = members; }
} 