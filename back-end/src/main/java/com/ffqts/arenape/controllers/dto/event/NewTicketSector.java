package com.ffqts.arenape.controllers.dto.event;

import com.ffqts.arenape.models.ticket.TicketLocation;

public record NewTicketSector(
    TicketLocation location,
    double price,
    int ticketsAvailable
) {}
