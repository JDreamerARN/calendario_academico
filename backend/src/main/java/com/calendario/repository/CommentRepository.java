package com.calendario.repository;

import com.calendario.model.Comment;
import com.calendario.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByEventOrderByCreatedAtAsc(Event event);
}
