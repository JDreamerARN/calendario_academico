package com.eventosacademicos.controller;

import com.eventosacademicos.model.User;
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
    
    @GetMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(UserDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(UserDTO.fromEntity(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsersSummary() {
        List<UserSummaryDTO> users = userService.getAllUsers().stream()
                .map(UserSummaryDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(users);
    }
}
