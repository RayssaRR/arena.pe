package com.ffqts.arenape.application.auth;

import com.ffqts.arenape.domain.models.user.Role;
import com.ffqts.arenape.domain.services.auth.IPromotesUser;
import com.ffqts.arenape.infra.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromotesUserService implements IPromotesUser {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void promotes(String email) {
        var user = userRepository.findUserByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        user.setRole(Role.ADMIN);
    }

}
