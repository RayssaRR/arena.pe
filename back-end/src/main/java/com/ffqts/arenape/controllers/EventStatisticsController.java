package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.statistics.EventStatisticsDTO;
import com.ffqts.arenape.services.EventStatisticsService;
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
public class EventStatisticsController {

    @Autowired
    private EventStatisticsService eventStatisticsService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{eventId}")
    public ResponseEntity<EventStatisticsDTO> getEventStatistics(@PathVariable String eventId) {
        try {
            UUID uuid = UUID.fromString(eventId);
            EventStatisticsDTO statistics = eventStatisticsService.getEventStatistics(uuid);
            return ResponseEntity.ok(statistics);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
