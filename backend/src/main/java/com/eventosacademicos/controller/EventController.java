package com.eventosacademicos.controller;

import com.eventosacademicos.dto.EventRequest;
import com.eventosacademicos.model.Event;
import com.eventosacademicos.model.EventMember;
import com.eventosacademicos.model.EventType;
import com.eventosacademicos.model.User;
import com.eventosacademicos.service.EventService;
import com.eventosacademicos.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest eventRequest) {
        try {
            // Obter usuário atual
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            // Criar evento
            Event event = new Event(
                eventRequest.getTitle(),
                eventRequest.getDescription(),
                eventRequest.getEventType(),
                eventRequest.getDate(),
                currentUser
            );
            
            Event createdEvent = eventService.createEvent(event);
            
            // Adicionar membros se especificados
            if (eventRequest.getMemberIds() != null && !eventRequest.getMemberIds().isEmpty()) {
                for (Long memberId : eventRequest.getMemberIds()) {
                    eventService.addMemberToEvent(createdEvent.getId(), memberId);
                }
            }
            
            return ResponseEntity.ok(createdEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Event>> getEvents() {
        try {
            // Obter usuário atual
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            List<Event> events = eventService.getEventsForUser(currentUser);
            return ResponseEntity.ok(events);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable EventType eventType) {
        List<Event> events = eventService.getEventsByType(eventType);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/academic")
    public ResponseEntity<List<Event>> getAcademicEvents() {
        List<Event> events = eventService.getAcademicEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/party")
    public ResponseEntity<List<Event>> getPartyEvents() {
        List<Event> events = eventService.getPartyEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{id}/members")
    public ResponseEntity<Set<EventMember>> getEventMembers(@PathVariable Long id) {
        try {
            Set<EventMember> members = eventService.getEventMembers(id);
            return ResponseEntity.ok(members);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest eventRequest) {
        try {
            // Obter usuário atual
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            // Criar objeto Event com os dados da requisição
            Event eventDetails = new Event();
            eventDetails.setTitle(eventRequest.getTitle());
            eventDetails.setDescription(eventRequest.getDescription());
            eventDetails.setEventType(eventRequest.getEventType());
            eventDetails.setDate(eventRequest.getDate());
            
            Event updatedEvent = eventService.updateEvent(id, eventDetails, currentUser);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            // Obter usuário atual
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            eventService.deleteEvent(id, currentUser);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{eventId}/members/{userId}")
    public ResponseEntity<Event> addMemberToEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            Event event = eventService.addMemberToEvent(eventId, userId);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{eventId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        try {
            eventService.removeMemberFromEvent(eventId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 