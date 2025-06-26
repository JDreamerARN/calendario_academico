package com.eventosacademicos.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/util")
public class PasswordUtilController {
    @PostMapping("/hash")
    public Map<String, String> hashPassword(@RequestBody Map<String, String> body) {
        String password = body.get("password");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        return Map.of("hash", hash);
    }
} 