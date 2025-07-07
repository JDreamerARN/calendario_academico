package com.eventosacademicos.dto;

public class EventMemberDTO {
    private Long id;
    private UserSummaryDTO user;

    public EventMemberDTO() {}

    public EventMemberDTO(Long id, UserSummaryDTO user) {
        this.id = id;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserSummaryDTO getUser() {
        return user;
    }

    public void setUser(UserSummaryDTO user) {
        this.user = user;
    }

    public static class UserSummaryDTO {
        private Long id;
        private String username;

        public UserSummaryDTO() {}

        public UserSummaryDTO(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
} 