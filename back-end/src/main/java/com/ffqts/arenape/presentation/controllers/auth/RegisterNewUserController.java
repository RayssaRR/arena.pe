package com.ffqts.arenape.presentation.controllers.auth;

import com.ffqts.arenape.domain.models.user.User;
import com.ffqts.arenape.domain.services.auth.IRegisterNewUser;
import com.ffqts.arenape.presentation.dto.RegisterForm;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class RegisterNewUserController {

    @Autowired
    private IRegisterNewUser service;

    @PostMapping("/register")
    public User register(@RequestBody @Valid RegisterForm newUser) {
        return service.register(
            newUser.name(),
            newUser.email(),
            newUser.password()
        );
    }

}
