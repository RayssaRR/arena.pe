package com.ffqts.adoteme.user.controller;

import com.ffqts.adoteme.user.dto.LoginRequest;
import com.ffqts.adoteme.user.dto.LoginResponse;
import com.ffqts.adoteme.user.entity.User;
import com.ffqts.adoteme.user.service.UserService;
import com.ffqts.adoteme.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    public User register(@RequestBody @Valid User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request) {
        User user = service.authenticate(request.getEmail(), request.getPassword());
        String token = JwtUtil.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }
}