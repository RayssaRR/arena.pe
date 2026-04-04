package com.ffqts.arenape.services;

import com.ffqts.arenape.config.JwtUtil;
import com.ffqts.arenape.controllers.dto.auth.RegisterForm;
import com.ffqts.arenape.models.RoleEnum;
import com.ffqts.arenape.models.User;
import com.ffqts.arenape.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public User register(RegisterForm registerForm) {
        if (userRepository.findUserByEmail(registerForm.email()).isPresent()) {
            throw new IllegalArgumentException("Email já registrado");
        }

        if (registerForm.role() == RoleEnum.ADMIN) {
            throw new IllegalArgumentException("Não é permitido registrar como ADMIN");
        }

        User newUser = new User();
        newUser.setName(registerForm.name());
        newUser.setEmail(registerForm.email());
        newUser.setPassword(passwordEncoder.encode(registerForm.password()));
        newUser.setRole(registerForm.role());

        return userRepository.save(newUser);
    }

    public String authenticate(String email, String rawPassword) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(email, rawPassword);
        var auth = this.authenticationManager.authenticate(usernamePassword);
        return JwtUtil.generateToken(((User) auth.getPrincipal()).getEmail());
    }
}