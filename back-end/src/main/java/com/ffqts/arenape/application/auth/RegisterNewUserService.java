package com.ffqts.arenape.application.auth;

import com.ffqts.arenape.domain.models.user.User;
import com.ffqts.arenape.domain.services.auth.IRegisterNewUser;
import com.ffqts.arenape.infra.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterNewUserService implements IRegisterNewUser {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(String username, String email, String password) {
        var userExists = userRepository.findUserByEmail(email).isPresent();
        if (userExists) { throw new IllegalArgumentException("Email já registrado"); }

        var encodedPassword = passwordEncoder.encode(password);
        var newUser = new User(username, email, encodedPassword);

        return userRepository.save(newUser);
    }
}
