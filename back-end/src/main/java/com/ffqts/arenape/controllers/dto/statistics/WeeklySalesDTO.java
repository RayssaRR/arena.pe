package com.ffqts.arenape.controllers.dto.statistics;

import java.util.List;

public record WeeklySalesDTO(
    String weekPeriod,
    Integer ticketsSold,
    Double revenue,
    List<TicketSalesPeriodDTO> dailyBreakdown
) {}
