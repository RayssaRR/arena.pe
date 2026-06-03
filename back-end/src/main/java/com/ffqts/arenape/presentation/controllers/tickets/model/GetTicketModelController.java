package com.ffqts.arenape.presentation.controllers.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.IGetTicketModels;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ticket-models")
public class GetTicketModelController {

    @Autowired
    private IGetTicketModels service;

    @GetMapping
    public ResponseEntity<List<TicketModel>> getAllTicketModels() {
        List<TicketModel> ticketModels = service.getAll();
        return ResponseEntity.ok(ticketModels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketModel> getTicketModelById(@PathVariable String id) {
        TicketModel ticketModel = service.getById(UUID.fromString(id));
        return ResponseEntity.ok(ticketModel);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TicketModel>> getTicketModelsByEventId(@PathVariable String eventId) {
        List<TicketModel> ticketModels = service.getByEventId(UUID.fromString(eventId));
        return ResponseEntity.ok(ticketModels);
    }

}
