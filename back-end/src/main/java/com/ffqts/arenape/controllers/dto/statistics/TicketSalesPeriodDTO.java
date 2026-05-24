package com.ffqts.arenape.controllers.dto.statistics;

public record TicketSalesPeriodDTO(
    String period,
    Integer ticketsSold,
    Double revenue
) {}
