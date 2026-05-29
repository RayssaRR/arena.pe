package com.ffqts.arenape.controllers.dto.ticket;

import com.ffqts.arenape.models.event.EventStatus;
import com.ffqts.arenape.models.ticket.TicketStatus;

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
