package com.calendario.dto;

public class AuthResponse {
    
    private String token;
    private Long id;
    private String username;
    private String message;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, Long id, String username) {
        this.token = token;
        this.id = id;
        this.username = username;
    }
    
    public AuthResponse(String message) {
        this.message = message;
    }
    
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
