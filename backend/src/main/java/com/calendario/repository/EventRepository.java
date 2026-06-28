package com.calendario.repository;

import com.calendario.model.Event;
import com.calendario.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByCreatedBy(User createdBy);
    
    List<Event> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.createdBy.id = :userId OR e.id IN (SELECT em.event.id FROM EventMember em WHERE em.user.id = :userId)")
    List<Event> findEventsForUser(@Param("userId") Long userId);
}
