package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.event.EventResponseDTO;
import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.controllers.utils.GetEmailFromTokenRequest;
import com.ffqts.arenape.models.event.Event;
import com.ffqts.arenape.services.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<EventResponseDTO>> getAllEvents(
    @RequestParam(required = false) Long categoryId
    ) {
        var events = (categoryId != null)
            ? eventService.getFilteredEventsWithDetails(categoryId)
            : eventService.getAllEventsWithDetails();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<EventResponseDTO>> getAllEventsWithDeleted() {
        var events = eventService.getAllEventsWithDeleted();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable String id) {
        var event = eventService.getEventByIdWithDetails(id);
        return ResponseEntity.ok(event);
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
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }



}
