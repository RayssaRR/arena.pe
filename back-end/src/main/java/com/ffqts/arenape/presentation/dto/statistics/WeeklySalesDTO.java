package com.ffqts.arenape.presentation.dto.statistics;

import java.util.List;

public record WeeklySalesDTO(
    String weekPeriod,
    Integer ticketsSold,
    Double revenue,
    List<TicketSalesPeriodDTO> dailyBreakdown
) {}
