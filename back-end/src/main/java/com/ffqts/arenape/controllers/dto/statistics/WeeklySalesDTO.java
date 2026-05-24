package com.ffqts.arenape.controllers.dto.statistics;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * DTO com dados de vendas semanais e decomposição diária
 */
public record WeeklySalesDTO(
    @JsonProperty("week_period")
    String weekPeriod,

    @JsonProperty("tickets_sold")
    Integer ticketsSold,

    @JsonProperty("revenue")
    Double revenue,

    @JsonProperty("daily_breakdown")
    List<TicketSalesPeriodDTO> dailyBreakdown
) {}
