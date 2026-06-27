package com.eventosacademicos.service;

import com.eventosacademicos.dto.CommentDTO;
import com.eventosacademicos.dto.EventMemberDTO;
import com.eventosacademicos.dto.EventResponseDTO;
import com.eventosacademicos.model.Comment;
import com.eventosacademicos.model.Event;
import com.eventosacademicos.model.EventMember;
import com.eventosacademicos.model.User;
import com.eventosacademicos.repository.CommentRepository;
import com.eventosacademicos.repository.EventMemberRepository;
import com.eventosacademicos.repository.EventRepository;
import com.eventosacademicos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventMemberRepository eventMemberRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
    
    public Optional<Event> getEventById(Long id, User currentUser) {
        return eventRepository.findById(id)
                .filter(event -> canViewEvent(event, currentUser));
    }
    
    public List<Event> getEventsForUser(User user) {
        return eventRepository.findEventsForUser(user.getId());
    }
    
    public List<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findByDateBetween(startDate, endDate);
    }
    
    public Event updateEvent(Long id, Event eventDetails, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canEditEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para editar este evento");
        }
        
        if (eventDetails.getTitle() != null) {
            event.setTitle(eventDetails.getTitle());
        }
        if (eventDetails.getDescription() != null) {
            event.setDescription(eventDetails.getDescription());
        }
        if (eventDetails.getDate() != null) {
            event.setDate(eventDetails.getDate());
        }
        if (eventDetails.getTags() != null) {
            event.setTags(new HashSet<>(eventDetails.getTags()));
        }
        if (eventDetails.getColor() != null) {
            event.setColor(eventDetails.getColor());
        }
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canDeleteEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para excluir este evento");
        }
        
        eventRepository.deleteById(id);
    }
    
    public Event addMemberToEvent(Long eventId, Long userId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canViewEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para acessar este evento");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (eventMemberRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("Usuário já é membro deste evento");
        }
        
        EventMember eventMember = new EventMember(event, user);
        eventMemberRepository.save(eventMember);
        
        return event;
    }
    
    @Transactional
    public void removeMemberFromEvent(Long eventId, Long userId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canViewEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para acessar este evento");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!eventMemberRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("Usuário não é membro deste evento");
        }
        
        eventMemberRepository.deleteByEventAndUser(event, user);
    }
    
    public Set<EventMember> getEventMembers(Long eventId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canViewEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para acessar este evento");
        }
        
        return event.getMembers();
    }
    
    public List<CommentDTO> getComments(Long eventId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canViewEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para acessar este evento");
        }
        
        return commentRepository.findByEventOrderByCreatedAtAsc(event).stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public CommentDTO addComment(Long eventId, String content, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canViewEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para comentar neste evento");
        }
        
        Comment comment = new Comment(content, event, currentUser);
        Comment saved = commentRepository.save(comment);
        return CommentDTO.fromEntity(saved);
    }
    
    public void deleteComment(Long eventId, Long commentId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (!canViewEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para acessar este evento");
        }
        
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
        
        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Sem permissão para excluir este comentário");
        }
        
        commentRepository.delete(comment);
    }
    
    private boolean canViewEvent(Event event, User currentUser) {
        if (event.getCreatedBy().getId().equals(currentUser.getId())) {
            return true;
        }
        return event.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(currentUser.getId()));
    }
    
    private boolean canEditEvent(Event event, User currentUser) {
        return event.getCreatedBy().getId().equals(currentUser.getId());
    }
    
    private boolean canDeleteEvent(Event event, User currentUser) {
        return event.getCreatedBy().getId().equals(currentUser.getId());
    }

    public static EventResponseDTO toEventResponseDTO(Event event) {
        EventMemberDTO.UserSummaryDTO organizer = new EventMemberDTO.UserSummaryDTO(
            event.getCreatedBy().getId(),
            event.getCreatedBy().getUsername()
        );
        List<EventMemberDTO> members = event.getMembers().stream().map(member ->
            new EventMemberDTO(
                member.getId(),
                new EventMemberDTO.UserSummaryDTO(
                    member.getUser().getId(),
                    member.getUser().getUsername()
                )
            )
        ).collect(Collectors.toList());
        List<CommentDTO> comments = (event.getComments() != null ? event.getComments() : java.util.List.<com.eventosacademicos.model.Comment>of())
                .stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
        return new EventResponseDTO(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getTags() != null ? event.getTags() : java.util.Collections.emptySet(),
            event.getColor() != null ? event.getColor() : "#1976d2",
            event.getDate(),
            organizer,
            members,
            comments
        );
    }
}
