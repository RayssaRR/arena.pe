package com.ffqts.arenape.presentation.controllers.tickets.user;

import com.ffqts.arenape.domain.services.tickets.user.ICancelUserTicketService;
import com.ffqts.arenape.presentation.dto.ticket.TicketCancellationResponseDTO;
import com.ffqts.arenape.utils.GetEmailFromTokenRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/ticket")
public class CancelUserTicketController {

    @Autowired
    private ICancelUserTicketService service;

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<?> cancelTicket(
        @PathVariable String ticketId,
        HttpServletRequest req
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            service.cancel(UUID.fromString(ticketId), email);
            return ResponseEntity.ok(new TicketCancellationResponseDTO(
            "Ticket cancelado com sucesso",
            ticketId,
            "CANCELED"
            ));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("permissão")) {
                return ResponseEntity.status(403).body(new TicketCancellationResponseDTO(
                e.getMessage(),
                ticketId,
                "FORBIDDEN"
                ));
            }
            return ResponseEntity.badRequest().body(new TicketCancellationResponseDTO(
            e.getMessage(),
            ticketId,
            "ERROR"
            ));
        }
    }
}
