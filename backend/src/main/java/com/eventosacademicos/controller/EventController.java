package com.eventosacademicos.controller;

import com.eventosacademicos.dto.CommentDTO;
import com.eventosacademicos.dto.CommentRequest;
import com.eventosacademicos.dto.EventRequest;
import com.eventosacademicos.dto.EventResponseDTO;
import com.eventosacademicos.model.Event;
import com.eventosacademicos.model.EventMember;
import com.eventosacademicos.model.User;
import com.eventosacademicos.service.EventService;
import com.eventosacademicos.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    private static final Logger logger = LoggerFactory.getLogger(EventController.class);
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUserByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
    
    private Set<String> normalizeTags(List<String> tags) {
        return tags.stream()
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toSet());
    }
    
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest eventRequest) {
        try {
            logger.info("Recebendo requisição para criar evento: {}", eventRequest);
            User currentUser = getCurrentUser();
            
            Event event = new Event(
                eventRequest.getTitle(),
                eventRequest.getDescription(),
                eventRequest.getDate(),
                currentUser
            );
            
            if (eventRequest.getTags() != null) {
                event.setTags(normalizeTags(eventRequest.getTags()));
            }
            if (eventRequest.getColor() != null && !eventRequest.getColor().isBlank()) {
                event.setColor(eventRequest.getColor());
            }
            
            Event createdEvent = eventService.createEvent(event);
            
            if (eventRequest.getMemberIds() != null && !eventRequest.getMemberIds().isEmpty()) {
                for (Long memberId : eventRequest.getMemberIds()) {
                    eventService.addMemberToEvent(createdEvent.getId(), memberId, currentUser);
                }
            }
            
            logger.info("Evento criado com sucesso: {}", createdEvent);
            return ResponseEntity.ok(createdEvent);
        } catch (RuntimeException e) {
            logger.error("Erro ao criar evento: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getEvents() {
        try {
            User currentUser = getCurrentUser();
            List<EventResponseDTO> events = eventService.getEventsForUser(currentUser).stream()
                    .map(EventService::toEventResponseDTO)
                    .toList();
            return ResponseEntity.ok(events);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            return eventService.getEventById(id, currentUser)
                    .map(event -> ResponseEntity.ok(EventService.toEventResponseDTO(event)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}/members")
    public ResponseEntity<Set<EventMember>> getEventMembers(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            Set<EventMember> members = eventService.getEventMembers(id, currentUser);
            return ResponseEntity.ok(members);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest eventRequest) {
        try {
            User currentUser = getCurrentUser();
            
            Event eventDetails = new Event();
            eventDetails.setTitle(eventRequest.getTitle());
            eventDetails.setDescription(eventRequest.getDescription());
            eventDetails.setDate(eventRequest.getDate());
            if (eventRequest.getTags() != null) {
                eventDetails.setTags(normalizeTags(eventRequest.getTags()));
            }
            if (eventRequest.getColor() != null) {
                eventDetails.setColor(eventRequest.getColor());
            }
            
            Event updatedEvent = eventService.updateEvent(id, eventDetails, currentUser);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            eventService.deleteEvent(id, currentUser);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{eventId}/members/{userId}")
    public ResponseEntity<Event> addMemberToEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            User currentUser = getCurrentUser();
            Event event = eventService.addMemberToEvent(eventId, userId, currentUser);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{eventId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            User currentUser = getCurrentUser();
            eventService.removeMemberFromEvent(eventId, userId, currentUser);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erro ao remover membro: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            List<CommentDTO> comments = eventService.getComments(id, currentUser);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id, @Valid @RequestBody CommentRequest commentRequest) {
        try {
            User currentUser = getCurrentUser();
            CommentDTO comment = eventService.addComment(id, commentRequest.getContent(), currentUser);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @PathVariable Long commentId) {
        try {
            User currentUser = getCurrentUser();
            eventService.deleteComment(id, commentId, currentUser);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
