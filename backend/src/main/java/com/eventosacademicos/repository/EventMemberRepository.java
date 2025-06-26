package com.eventosacademicos.repository;

import com.eventosacademicos.model.Event;
import com.eventosacademicos.model.EventMember;
import com.eventosacademicos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
    
    List<EventMember> findByEvent(Event event);
    
    List<EventMember> findByUser(User user);
    
    Optional<EventMember> findByEventAndUser(Event event, User user);
    
    boolean existsByEventAndUser(Event event, User user);
    
    void deleteByEventAndUser(Event event, User user);
} 