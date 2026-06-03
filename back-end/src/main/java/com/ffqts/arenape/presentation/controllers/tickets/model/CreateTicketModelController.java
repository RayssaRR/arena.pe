package com.ffqts.arenape.presentation.controllers.tickets.model;

import com.ffqts.arenape.domain.models.ticket.TicketModel;
import com.ffqts.arenape.domain.services.tickets.model.ICreateTicketModel;
import com.ffqts.arenape.presentation.dto.ticket.NewTicketModelForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ticket-models")
public class CreateTicketModelController {

    @Autowired
    private ICreateTicketModel service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<TicketModel> createTicketModel(@RequestBody NewTicketModelForm form) {
        TicketModel ticketModel = service.create(form);
        return ResponseEntity.status(201).body(ticketModel);
    }

}
