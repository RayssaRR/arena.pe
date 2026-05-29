package com.ffqts.arenape.controllers.dto.event;

import com.ffqts.arenape.models.ticket.TicketLocation;

public record TicketSectorDTO(
    String id,
    TicketLocation location,
    double price,
    int ticketsAvailable,
    int ticketsSold
) {}
