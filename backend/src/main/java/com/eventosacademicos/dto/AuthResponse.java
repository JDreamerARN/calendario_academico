package com.eventosacademicos.dto;

import com.eventosacademicos.model.UserType;

public class AuthResponse {
    
    private String token;
    private Long id;
    private String username;
    private UserType userType;
    private String message;
    
    // Construtores
    public AuthResponse() {}
    
    public AuthResponse(String token, Long id, String username, UserType userType) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.userType = userType;
    }
    
    public AuthResponse(String message) {
        this.message = message;
    }
    
    // Getters e Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public UserType getUserType() {
        return userType;
    }
    
    public void setUserType(UserType userType) {
        this.userType = userType;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
} 