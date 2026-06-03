package com.ffqts.arenape.presentation.dto.ticket;

import com.ffqts.arenape.domain.models.ticket.TicketStatus;

import java.time.LocalDateTime;

public record ConsumeTicketResponseDTO(
    String ticketId,
    LocalDateTime eventDate,
    String userName,
    TicketStatus ticketStatus,
    LocalDateTime createdAt
) {}
