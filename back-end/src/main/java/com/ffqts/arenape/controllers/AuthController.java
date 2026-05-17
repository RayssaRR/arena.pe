package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.auth.LoginRequest;
import com.ffqts.arenape.controllers.dto.auth.LoginResponse;
import com.ffqts.arenape.controllers.dto.auth.RegisterForm;
import com.ffqts.arenape.models.User;
import com.ffqts.arenape.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public User register(@RequestBody @Valid RegisterForm newUser) {
        return service.register(newUser);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request) {
        String token = service.authenticate(request.email(), request.password());
        return new LoginResponse(token);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/promote")
    public void promoteUser(@RequestParam String email) {
        service.promotesUser(email);
    }

}