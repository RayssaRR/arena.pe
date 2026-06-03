package com.ffqts.arenape.presentation.controllers.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.IUpdateTicketModel;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/ticket-models")
public class UpdateTicketModelController {

    @Autowired
    private IUpdateTicketModel service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TicketModel> updateTicketModel(
        @PathVariable String id,
        @RequestBody NewTicketModelForm form
    ) {
        TicketModel ticketModel = service.update(UUID.fromString(id), form);
        return ResponseEntity.ok(ticketModel);
    }

}
