package com.eventosacademicos.controller;

import com.eventosacademicos.model.User;
import com.eventosacademicos.model.UserType;
import com.eventosacademicos.service.UserService;
import com.eventosacademicos.dto.UserDTO;
import com.eventosacademicos.dto.UserSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers().stream().map(UserDTO::fromEntity).toList();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or #id == authentication.principal.id")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(UserDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{userType}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UserDTO>> getUsersByType(@PathVariable UserType userType) {
        List<UserDTO> users = userService.getUsersByType(userType).stream().map(UserDTO::fromEntity).toList();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UserDTO>> getPendingUsers() {
        List<UserDTO> pendingUsers = userService.getPendingUsers().stream().map(UserDTO::fromEntity).toList();
        return ResponseEntity.ok(pendingUsers);
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UserDTO> approveUser(@PathVariable Long id) {
        try {
            User approvedUser = userService.approveUser(id);
            return ResponseEntity.ok(UserDTO.fromEntity(approvedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or #id == authentication.principal.id")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(UserDTO.fromEntity(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsersSummary() {
        List<UserSummaryDTO> users = userService.getAllApprovedUsers().stream()
                .map(UserSummaryDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(users);
    }
} 