package com.eventosacademicos.repository;

import com.eventosacademicos.model.User;
import com.eventosacademicos.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByRegistrationNumber(String registrationNumber);
    
    List<User> findByUserType(UserType userType);
    
    List<User> findByApproved(boolean approved);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByRegistrationNumber(String registrationNumber);
} 