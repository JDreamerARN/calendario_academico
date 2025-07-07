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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.eventosacademicos.dto.EventResponseDTO;
import com.eventosacademicos.dto.EventMemberDTO;

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
    
    @Transactional
    public void removeMemberFromEvent(Long eventId, Long userId) {
        System.out.println("[SERVICE] Iniciando remoção de membro: eventId=" + eventId + ", userId=" + userId);
        
        System.out.println("[SERVICE] Buscando evento com ID: " + eventId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    System.out.println("[SERVICE] ERRO: Evento não encontrado com ID: " + eventId);
                    return new RuntimeException("Evento não encontrado");
                });
        System.out.println("[SERVICE] Evento encontrado: " + event.getTitle());
        
        System.out.println("[SERVICE] Buscando usuário com ID: " + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.out.println("[SERVICE] ERRO: Usuário não encontrado com ID: " + userId);
                    return new RuntimeException("Usuário não encontrado");
                });
        System.out.println("[SERVICE] Usuário encontrado: " + user.getUsername());
        
        System.out.println("[SERVICE] Verificando se usuário é membro do evento...");
        boolean isMember = eventMemberRepository.existsByEventAndUser(event, user);
        System.out.println("[SERVICE] Usuário é membro do evento? " + isMember);
        
        if (!isMember) {
            System.out.println("[SERVICE] ERRO: Usuário não é membro deste evento");
            throw new RuntimeException("Usuário não é membro deste evento");
        }
        
        System.out.println("[SERVICE] Removendo membro do evento...");
        eventMemberRepository.deleteByEventAndUser(event, user);
        System.out.println("[SERVICE] Remoção concluída para: eventId=" + eventId + ", userId=" + userId);
    }
    
    public Set<EventMember> getEventMembers(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        return event.getMembers();
    }
    
    private void validateEventCreation(Event event) {
        User creator = event.getCreatedBy();
        
        // Administradores podem criar qualquer tipo de evento
        if (creator.getUserType() == com.eventosacademicos.model.UserType.ADMINISTRADOR) {
            return;
        }
        
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

    public static EventResponseDTO toEventResponseDTO(Event event) {
        EventMemberDTO.UserSummaryDTO organizer = new EventMemberDTO.UserSummaryDTO(
            event.getCreatedBy().getId(),
            event.getCreatedBy().getUsername()
        );
        java.util.List<EventMemberDTO> members = event.getMembers().stream().map(member ->
            new EventMemberDTO(
                member.getId(),
                new EventMemberDTO.UserSummaryDTO(
                    member.getUser().getId(),
                    member.getUser().getUsername()
                )
            )
        ).collect(Collectors.toList());
        return new EventResponseDTO(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getEventType(),
            event.getDate(),
            organizer,
            members
        );
    }
} 