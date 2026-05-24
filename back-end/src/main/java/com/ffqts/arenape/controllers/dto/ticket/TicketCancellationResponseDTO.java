package com.ffqts.arenape.controllers.dto.ticket;

public record TicketCancellationResponseDTO(
    String message,
    String ticketId,
    String status
) {}
