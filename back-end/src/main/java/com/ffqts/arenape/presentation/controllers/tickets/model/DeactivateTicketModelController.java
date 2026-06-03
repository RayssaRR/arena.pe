package com.ffqts.arenape.presentation.controllers.tickets.model;

import com.ffqts.arenape.domain.services.tickets.model.IDeactivateTicketModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/ticket-models")
public class DeactivateTicketModelController {

    @Autowired
    private IDeactivateTicketModel service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketModel(@PathVariable String id) {
        service.deactivate(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

}
