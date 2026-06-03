package com.ffqts.arenape.application.auth;

import com.ffqts.arenape.domain.models.user.User;
import com.ffqts.arenape.domain.services.auth.IAuthenticateUser;
import com.ffqts.arenape.infra.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateUserService implements IAuthenticateUser {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public String auth(String email, String password) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(email, password);
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var user = ((User) auth.getPrincipal());
        return JwtUtil.generateToken(
            user.getEmail(),
            user.getRole().toString(),
            user.getName()
        );
    }

}
