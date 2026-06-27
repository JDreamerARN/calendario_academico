package com.eventosacademicos.controller;

import com.eventosacademicos.dto.AuthResponse;
import com.eventosacademicos.dto.LoginRequest;
import com.eventosacademicos.dto.RegisterRequest;
import com.eventosacademicos.model.User;
import com.eventosacademicos.model.UserType;
import com.eventosacademicos.security.JwtTokenProvider;
import com.eventosacademicos.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<String> pendingMessage = userService.getPendingApprovalMessage(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );
        if (pendingMessage.isPresent()) {
            return ResponseEntity.badRequest().body(new AuthResponse(pendingMessage.get()));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            User user = userService.getUserByUsername(loginRequest.getUsername()).orElse(null);
            
            return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getUsername(), user.getUserType()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse("Credenciais inválidas"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPhone(),
                registerRequest.getPassword(),
                registerRequest.getRegistrationNumber(),
                registerRequest.getUserType()
            );
            
            userService.createUser(user);
            
            String message = registerRequest.getUserType() == UserType.ADMINISTRADOR
                    ? "Usuário administrador registrado com sucesso. Você já pode fazer login."
                    : "Usuário registrado com sucesso. Aguarde aprovação do administrador.";
            
            return ResponseEntity.ok(new AuthResponse(message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API de autenticação funcionando!");
    }
} 