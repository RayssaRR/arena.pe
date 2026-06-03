package com.ffqts.arenape.presentation.controllers.auth;

import com.ffqts.arenape.domain.services.auth.IAuthenticateUser;
import com.ffqts.arenape.presentation.dto.LoginRequest;
import com.ffqts.arenape.presentation.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticateUserController {

    @Autowired
    private IAuthenticateUser service;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request) {
        var token = service.auth(request.email(), request.password());
        return new LoginResponse(token);
    }

}
