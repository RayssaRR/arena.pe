package com.ffqts.arenape.presentation.dto.ticket;

import com.ffqts.arenape.domain.models.event.EventStatus;
import com.ffqts.arenape.domain.models.ticket.TicketStatus;

import java.time.LocalDateTime;

public record UserTicketResponseDTO(
    String ticketId,
    String eventTitle,
    String eventId,
    LocalDateTime eventDate,
    EventStatus eventStatus,
    Double price,
    String location,
    TicketStatus ticketStatus,
    LocalDateTime createdAt
) {}
