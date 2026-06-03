package com.ffqts.arenape.presentation.dto.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record NewReservationForm(

        @NotBlank(message = "Id do ticket model não pode ficar em branco")
        UUID ticketModelId,

        @Positive(message = "Quantidade de tickets deve ser maior que 0")
        Integer quantity

) {}
