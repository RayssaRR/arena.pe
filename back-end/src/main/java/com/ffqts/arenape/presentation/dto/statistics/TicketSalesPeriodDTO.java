package com.ffqts.arenape.presentation.dto.statistics;

public record TicketSalesPeriodDTO(
    String period,
    Integer ticketsSold,
    Double revenue
) {}
