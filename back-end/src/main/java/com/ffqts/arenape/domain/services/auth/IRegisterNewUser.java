package com.ffqts.arenape.domain.services.auth;

import com.ffqts.arenape.domain.models.user.User;

public interface IRegisterNewUser {
    User register(String username, String email, String password);
}
