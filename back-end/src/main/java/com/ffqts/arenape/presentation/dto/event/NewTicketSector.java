package com.ffqts.arenape.presentation.dto.event;

import com.ffqts.arenape.domain.models.ticket.TicketLocation;

public record NewTicketSector(
    TicketLocation location,
    double price,
    int ticketsAvailable
) {}
