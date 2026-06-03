package com.ffqts.arenape.presentation.controllers.tickets.user;

import com.ffqts.arenape.domain.models.ticket.TicketStatus;
import com.ffqts.arenape.domain.services.tickets.user.IConsumeUserTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
public class ConsumeUserTicketController {

    @Autowired
    private IConsumeUserTicketService service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{ticketId}/consume")
    public ResponseEntity<?> consumeTicket(@PathVariable String ticketId) {
        var userTicket = service.consume(ticketId);
        boolean isValid = userTicket.getStatus() == TicketStatus.RESGATADO;
        return ResponseEntity.ok(isValid);
    }

}
