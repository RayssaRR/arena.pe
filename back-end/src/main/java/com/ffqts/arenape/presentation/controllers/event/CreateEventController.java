package com.ffqts.arenape.presentation.controllers.event;

import com.ffqts.arenape.domain.models.event.Event;
import com.ffqts.arenape.domain.services.event.ICreateEvent;
import com.ffqts.arenape.presentation.dto.event.NewEventForm;
import com.ffqts.arenape.presentation.utils.GetEmailFromTokenRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/events")
public class CreateEventController {

    @Autowired
    private ICreateEvent service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Event> createEvent(
        @RequestBody NewEventForm newEventForm,
        HttpServletRequest req
    ) {
        var email = GetEmailFromTokenRequest.get(req);
        var createdEvent = service.create(
            newEventForm.title(),
            newEventForm.description(),
            newEventForm.eventDate(),
            newEventForm.imageUrl(),
            newEventForm.categoryId(),
            newEventForm.tickets(),
            email
        );
        return ResponseEntity.status(201).body(createdEvent);
    }

}
