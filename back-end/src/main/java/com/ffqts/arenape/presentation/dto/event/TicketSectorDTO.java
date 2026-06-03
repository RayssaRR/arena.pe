package com.ffqts.arenape.presentation.dto.event;

import com.ffqts.arenape.domain.models.ticket.TicketLocation;

public record TicketSectorDTO(
    String id,
    TicketLocation location,
    double price,
    int ticketsAvailable,
    int ticketsSold
) {}
