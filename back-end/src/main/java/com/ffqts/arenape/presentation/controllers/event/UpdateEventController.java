package com.ffqts.arenape.presentation.controllers.event;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.services.event.IUpdateEvent;
import com.ffqts.arenape.presentation.dto.event.NewEventForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
public class UpdateEventController {

    @Autowired
    private IUpdateEvent service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEventById(
        @PathVariable String id,
        @RequestBody NewEventForm updatedEventForm
    ) {
        var updatedEvent = service.update(
            updatedEventForm.title(),
            updatedEventForm.description(),
            updatedEventForm.eventDate(),
            updatedEventForm.imageUrl(),
            updatedEventForm.categoryId(),
            id
        );

        return ResponseEntity.ok(updatedEvent);
    }

}
