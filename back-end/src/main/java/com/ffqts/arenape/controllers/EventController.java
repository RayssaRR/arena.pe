package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.controllers.utils.GetEmailFromTokenRequest;
import com.ffqts.arenape.models.Event;
import com.ffqts.arenape.models.EventStatus;
import com.ffqts.arenape.services.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(
    @RequestParam(required = false) String title,
    @RequestParam(required = false) EventStatus status,
    @RequestParam(required = false) Long categoryId,
    @RequestParam(required = false) LocalDate date,
    @RequestParam(required = false) String orderBy,
    @RequestParam(required = false) String direction
    ) {
        var events = eventService.getFilteredEvents(title, status, categoryId, date, orderBy, direction);
        return ResponseEntity.ok(events);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody NewEventForm newEventForm, HttpServletRequest req) {
        var email = GetEmailFromTokenRequest.get(req);
        var createdEvent = eventService.createEvent(newEventForm, email);
        return ResponseEntity.status(201).body(createdEvent);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEventById(
        @PathVariable String id,
        @RequestBody NewEventForm updatedEventForm
    ) {
        var updatedEvent = eventService.updateEvent(updatedEventForm, id);
        return ResponseEntity.ok(updatedEvent);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventById(@PathVariable String id, HttpServletRequest req) {
        var email = GetEmailFromTokenRequest.get(req);
        eventService.deleteEvent(id, email);
        return ResponseEntity.noContent().build();
    }



}
