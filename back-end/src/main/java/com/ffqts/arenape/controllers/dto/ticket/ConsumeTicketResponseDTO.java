package com.ffqts.arenape.controllers.dto.ticket;

import com.ffqts.arenape.models.ticket.TicketStatus;

import java.time.LocalDateTime;

public record ConsumeTicketResponseDTO(
    String ticketId,
    LocalDateTime eventDate,
    String userName,
    TicketStatus ticketStatus,
    LocalDateTime createdAt
) {}
