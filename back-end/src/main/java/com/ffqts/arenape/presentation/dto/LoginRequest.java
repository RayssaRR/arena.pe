package com.ffqts.arenape.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
  @Email(message = "Email inválido")
  @NotBlank(message = "Email não pode ficar em branco")
  String email,

  @NotBlank(message = "Senha não pode ficar em branco")
  String password
) {
}
