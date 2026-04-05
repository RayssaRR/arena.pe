package com.ffqts.arenape.controllers;

import com.ffqts.arenape.config.JwtUtil;
import com.ffqts.arenape.controllers.dto.event.NewEventForm;
import com.ffqts.arenape.models.Event;
import com.ffqts.arenape.repositories.UserRepository;
import com.ffqts.arenape.services.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody NewEventForm newEventForm, HttpServletRequest req) {
        var email = getEmailFromTokenRequest(req);
        var createdEvent = eventService.createEvent(newEventForm, email);
        return ResponseEntity.status(201).body(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEventById(
        @PathVariable String id,
        @RequestBody NewEventForm updatedEventForm,
        HttpServletRequest req
    ) {
        var email = getEmailFromTokenRequest(req);
        var updatedEvent = eventService.updateEvent(updatedEventForm, id, email);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventById(@PathVariable String id, HttpServletRequest req) {
        var email = getEmailFromTokenRequest(req);
        eventService.deleteEvent(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    private String getEmailFromTokenRequest(HttpServletRequest req) {
        String token = req.getHeader("Authorization");
        String actualToken = token.replace("Bearer ", "");
        return JwtUtil.validate(actualToken);
    }

}
