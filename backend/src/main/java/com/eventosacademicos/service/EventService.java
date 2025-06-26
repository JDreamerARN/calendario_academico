package com.eventosacademicos.service;

import com.eventosacademicos.model.Event;
import com.eventosacademicos.model.EventMember;
import com.eventosacademicos.model.EventType;
import com.eventosacademicos.model.User;
import com.eventosacademicos.repository.EventMemberRepository;
import com.eventosacademicos.repository.EventRepository;
import com.eventosacademicos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventMemberRepository eventMemberRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Event createEvent(Event event) {
        // Validar permissões baseadas no tipo de evento e usuário
        validateEventCreation(event);
        
        return eventRepository.save(event);
    }
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public List<Event> getEventsForUser(User user) {
        return eventRepository.findEventsForUser(user.getId());
    }
    
    public List<Event> getEventsByType(EventType eventType) {
        return eventRepository.findByEventType(eventType);
    }
    
    public List<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Event> getAcademicEvents() {
        return eventRepository.findAcademicEvents();
    }
    
    public List<Event> getPartyEvents() {
        return eventRepository.findPartyEvents();
    }
    
    public Event updateEvent(Long id, Event eventDetails, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        // Verificar permissões
        if (!canEditEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para editar este evento");
        }
        
        // Atualizar campos permitidos
        if (eventDetails.getTitle() != null) {
            event.setTitle(eventDetails.getTitle());
        }
        if (eventDetails.getDescription() != null) {
            event.setDescription(eventDetails.getDescription());
        }
        if (eventDetails.getDate() != null) {
            event.setDate(eventDetails.getDate());
        }
        if (eventDetails.getEventType() != null) {
            event.setEventType(eventDetails.getEventType());
        }
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        // Verificar permissões
        if (!canDeleteEvent(event, currentUser)) {
            throw new RuntimeException("Sem permissão para excluir este evento");
        }
        
        eventRepository.deleteById(id);
    }
    
    public Event addMemberToEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (eventMemberRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("Usuário já é membro deste evento");
        }
        
        EventMember eventMember = new EventMember(event, user);
        eventMemberRepository.save(eventMember);
        
        return event;
    }
    
    public void removeMemberFromEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        eventMemberRepository.deleteByEventAndUser(event, user);
    }
    
    public Set<EventMember> getEventMembers(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        return event.getMembers();
    }
    
    private void validateEventCreation(Event event) {
        User creator = event.getCreatedBy();
        
        // Professores podem criar provas e trabalhos
        if (event.getEventType() == EventType.PROVA || event.getEventType() == EventType.TRABALHO) {
            if (creator.getUserType() != com.eventosacademicos.model.UserType.PROFESSOR) {
                throw new RuntimeException("Apenas professores podem criar provas e trabalhos");
            }
        }
        
        // Alunos podem criar eventos de festa
        if (event.getEventType() == EventType.FESTA) {
            if (creator.getUserType() != com.eventosacademicos.model.UserType.ALUNO) {
                throw new RuntimeException("Apenas alunos podem criar eventos de festa");
            }
        }
    }
    
    private boolean canEditEvent(Event event, User currentUser) {
        // Administradores podem editar qualquer evento
        if (currentUser.getUserType() == com.eventosacademicos.model.UserType.ADMINISTRADOR) {
            return true;
        }
        
        // Criador do evento pode editá-lo
        return event.getCreatedBy().getId().equals(currentUser.getId());
    }
    
    private boolean canDeleteEvent(Event event, User currentUser) {
        // Administradores podem excluir qualquer evento
        if (currentUser.getUserType() == com.eventosacademicos.model.UserType.ADMINISTRADOR) {
            return true;
        }
        
        // Criador do evento pode excluí-lo
        return event.getCreatedBy().getId().equals(currentUser.getId());
    }
} 