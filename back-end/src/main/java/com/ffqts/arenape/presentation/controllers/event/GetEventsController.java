package com.ffqts.arenape.presentation.controllers.event;

import com.ffqts.arenape.domain.services.event.IGetEvents;
import com.ffqts.arenape.domain.services.event.IGetUserPurchasedEventsService;
import com.ffqts.arenape.presentation.dto.event.EventResponseDTO;
import com.ffqts.arenape.presentation.dto.event.PagedUserEventsDTO;
import com.ffqts.arenape.presentation.utils.CreateEventResponse;
import com.ffqts.arenape.presentation.utils.GetEmailFromTokenRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class GetEventsController {

    @Autowired
    private IGetEvents getEventsService;

    @Autowired
    private IGetUserPurchasedEventsService service;

    @Autowired
    private CreateEventResponse createEventResponse;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<EventResponseDTO>> getAllEvents(
    @RequestParam(required = false) Long categoryId
    ) {
        var events = (categoryId != null)
            ? getEventsService.getByCategoryId(categoryId)
            : getEventsService.getAllActive();

        var eventsResponse = events.stream()
            .map(createEventResponse::create)
            .toList();

        return ResponseEntity.ok(eventsResponse);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<EventResponseDTO>> getAllEventsWithDeleted() {
        var events = getEventsService.getAllWithDeleted();
        var eventsResponse = events.stream()
            .map(createEventResponse::create)
            .toList();
        return ResponseEntity.ok(eventsResponse);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable String id) {
        var event = getEventsService.getById(id);
        var eventResponse = createEventResponse.create(event);
        return ResponseEntity.ok(eventResponse);
    }

    @GetMapping("/purchased")
    public ResponseEntity<PagedUserEventsDTO> getUserPurchasedEvents(
        HttpServletRequest req,
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer pageSize
    ) {
        var email = GetEmailFromTokenRequest.get(req);
        PagedUserEventsDTO result = service.get(email, page, pageSize);
        return ResponseEntity.ok(result);
    }
}
