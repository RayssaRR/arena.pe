package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.LoginRequest;
import com.ffqts.arenape.controllers.dto.LoginResponse;
import com.ffqts.arenape.models.User;
import com.ffqts.arenape.services.UserService;
import com.ffqts.arenape.config.JwtUtil;
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