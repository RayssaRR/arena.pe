package com.ffqts.arenape.domain.services.auth;

public interface IAuthenticateUser {
    String auth(String email, String password);
}
