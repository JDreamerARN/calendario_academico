package com.eventosacademicos.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class EventResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Set<String> tags;
    private String color;
    private LocalDateTime date;
    private EventMemberDTO.UserSummaryDTO organizer;
    private List<EventMemberDTO> members;
    private List<CommentDTO> comments;

    public EventResponseDTO() {}

    public EventResponseDTO(Long id, String title, String description, Set<String> tags, String color,
                            LocalDateTime date, EventMemberDTO.UserSummaryDTO organizer,
                            List<EventMemberDTO> members, List<CommentDTO> comments) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.color = color;
        this.date = date;
        this.organizer = organizer;
        this.members = members;
        this.comments = comments;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public EventMemberDTO.UserSummaryDTO getOrganizer() { return organizer; }
    public void setOrganizer(EventMemberDTO.UserSummaryDTO organizer) { this.organizer = organizer; }
    public List<EventMemberDTO> getMembers() { return members; }
    public void setMembers(List<EventMemberDTO> members) { this.members = members; }
    public List<CommentDTO> getComments() { return comments; }
    public void setComments(List<CommentDTO> comments) { this.comments = comments; }
}
