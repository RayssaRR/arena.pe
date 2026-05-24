package com.ffqts.arenape.controllers.dto.statistics;

import java.util.List;

public record EventStatisticsDTO(
    Double totalRevenue,
    Integer ticketsSold,
    Integer ticketsAvailable,
    Double averageTicketPrice,
    List<WeeklySalesDTO> salesByPeriod
) {}
