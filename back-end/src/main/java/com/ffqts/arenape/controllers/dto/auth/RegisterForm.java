package com.ffqts.arenape.controllers.dto.auth;

import com.ffqts.arenape.models.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterForm(
  @NotBlank(message = "Nome não pode ficar em branco")
  String name,

  @Email(message = "Email inválido")
  @NotBlank(message = "Email não pode ficar em branco")
  String email,

  @NotBlank(message = "Senha não pode ficar em branco")
  String password
) {
}
