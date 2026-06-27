package com.eventosacademicos.repository;

import com.eventosacademicos.model.Comment;
import com.eventosacademicos.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByEventOrderByCreatedAtAsc(Event event);
}
