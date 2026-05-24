package com.ffqts.arenape.controllers.dto.ticket;

import com.ffqts.arenape.models.ticket.TicketLocation;

import java.util.UUID;

public record NewTicketModelForm(
    UUID eventId,
    String title,
    TicketLocation ticketLocation,
    double price,
    String description,
    int ticketsAvailable
) {
}

