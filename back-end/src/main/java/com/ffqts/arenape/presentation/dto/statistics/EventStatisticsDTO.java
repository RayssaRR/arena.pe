package com.ffqts.arenape.presentation.dto.statistics;

import java.util.List;

public record EventStatisticsDTO(
    Double totalRevenue,
    Integer ticketsSold,
    Integer ticketsAvailable,
    Double averageTicketPrice,
    List<WeeklySalesDTO> salesByPeriod
) {}
