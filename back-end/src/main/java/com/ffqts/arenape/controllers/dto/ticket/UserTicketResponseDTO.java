package com.ffqts.arenape.controllers.dto.ticket;

import java.time.LocalDateTime;

public record UserTicketResponseDTO(
    String ticketId,
    String eventTitle,
    String eventId,
    String ticketModelTitle,
    Double price,
    String location,
    Boolean isValid,
    LocalDateTime createdAt
) {}
