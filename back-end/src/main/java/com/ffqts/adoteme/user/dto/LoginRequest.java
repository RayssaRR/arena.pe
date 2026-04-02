package com.ffqts.adoteme.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @Email(message = "Email inválido")
    @NotBlank(message = "Email não pode ficar em branco")
    private String email;

    @NotBlank(message = "Senha não pode ficar em branco")
    private String password;

    // getters e setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}