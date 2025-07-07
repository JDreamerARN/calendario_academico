package com.eventosacademicos.dto;

import com.eventosacademicos.model.User;
import com.eventosacademicos.model.UserType;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String registrationNumber;
    private UserType userType;
    private boolean approved;

    public UserDTO() {}

    public UserDTO(Long id, String username, String email, String phone, String registrationNumber, UserType userType, boolean approved) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.registrationNumber = registrationNumber;
        this.userType = userType;
        this.approved = approved;
    }

    public static UserDTO fromEntity(User user) {
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPhone(),
            user.getRegistrationNumber(),
            user.getUserType(),
            user.isApproved()
        );
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
} 