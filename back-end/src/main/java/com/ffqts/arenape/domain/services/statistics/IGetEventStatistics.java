package com.ffqts.arenape.domain.services.statistics;

import com.ffqts.arenape.presentation.dto.statistics.EventStatisticsDTO;

import java.util.UUID;

public interface IGetEventStatistics {
    EventStatisticsDTO get(UUID eventId);
}
