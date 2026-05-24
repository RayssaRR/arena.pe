package com.ffqts.arenape.services;

import com.ffqts.arenape.config.JwtUtil;
import com.ffqts.arenape.controllers.dto.auth.RegisterForm;
import com.ffqts.arenape.controllers.dto.auth.LoginResponse;
import com.ffqts.arenape.models.user.Role;
import com.ffqts.arenape.models.user.User;
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
        var userExists = userRepository.findUserByEmail(registerForm.email()).isPresent();
        if (userExists) { throw new IllegalArgumentException("Email já registrado"); }

        var encodedPassword = passwordEncoder.encode(registerForm.password());
        var newUser = new User(registerForm.name(), registerForm.email(), encodedPassword);

        return userRepository.save(newUser);
    }

    public LoginResponse authenticate(String email, String rawPassword) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(email, rawPassword);
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var user = ((User) auth.getPrincipal());
        var token = JwtUtil.generateToken(user.getEmail(), user.getRole().toString(), user.getName());
        return new LoginResponse(token);
    }

    public void promotesUser(String email) {
        var user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

}