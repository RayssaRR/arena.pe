package com.ffqts.arenape.presentation.controllers.statistics;

import com.ffqts.arenape.domain.services.statistics.IGetEventStatistics;
import com.ffqts.arenape.presentation.dto.statistics.EventStatisticsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/events/statistics")
public class GetEventStatisticsController {

    @Autowired
    private IGetEventStatistics service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{eventId}")
    public ResponseEntity<EventStatisticsDTO> getEventStatistics(@PathVariable String eventId) {
        try {
            UUID uuid = UUID.fromString(eventId);
            EventStatisticsDTO statistics = service.get(uuid);
            return ResponseEntity.ok(statistics);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
