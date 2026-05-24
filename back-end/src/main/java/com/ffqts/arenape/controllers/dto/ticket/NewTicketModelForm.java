package com.ffqts.arenape.controllers.dto.ticket;

import com.ffqts.arenape.models.ticket.TicketLocation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

public record NewTicketModelForm(
    @NotBlank(message = "Id do evento não pode ficar em branco")
    UUID eventId,

    @NotBlank(message = "Titulo do Ticket não pode ficar em branco")
    String title,

    @NotBlank(message = "Local do ticket não pode ficar em branco")
    TicketLocation ticketLocation,

    @PositiveOrZero(message = "Preço do ticket deve ser um número positivo ou zero")
    double price,

    @NotBlank(message = "Descrição do ticket não pode ficar em branco")
    String description,

    @PositiveOrZero(message = "Quantidade de tickets disponíveis deve ser um número positivo ou zero")
    int ticketsAvailable
) {
}

