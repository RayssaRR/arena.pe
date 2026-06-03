package com.ffqts.arenape.presentation.dto.ticket;

public record TicketCancellationResponseDTO(
    String message,
    String ticketId,
    String status
) {}
