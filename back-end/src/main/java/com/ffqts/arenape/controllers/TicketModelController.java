package com.ffqts.arenape.controllers;

import com.ffqts.arenape.controllers.dto.ticket.NewTicketModelForm;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.services.TicketModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ticket-models")
public class TicketModelController {

    @Autowired
    private TicketModelService ticketModelService;

    @GetMapping
    public ResponseEntity<List<TicketModel>> getAllTicketModels() {
        List<TicketModel> ticketModels = ticketModelService.getAllTicketModels();
        return ResponseEntity.ok(ticketModels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketModel> getTicketModelById(@PathVariable String id) {
        TicketModel ticketModel = ticketModelService.getTicketModelById(UUID.fromString(id));
        return ResponseEntity.ok(ticketModel);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TicketModel>> getTicketModelsByEventId(@PathVariable String eventId) {
        List<TicketModel> ticketModels = ticketModelService.getTicketModelsByEventId(UUID.fromString(eventId));
        return ResponseEntity.ok(ticketModels);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<TicketModel> createTicketModel(@RequestBody NewTicketModelForm form) {
        TicketModel ticketModel = ticketModelService.createTicketModel(form);
        return ResponseEntity.status(201).body(ticketModel);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TicketModel> updateTicketModel(
            @PathVariable String id,
            @RequestBody NewTicketModelForm form
    ) {
        TicketModel ticketModel = ticketModelService.updateTicketModel(UUID.fromString(id), form);
        return ResponseEntity.ok(ticketModel);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketModel(@PathVariable String id) {
        ticketModelService.deleteTicketModel(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}

