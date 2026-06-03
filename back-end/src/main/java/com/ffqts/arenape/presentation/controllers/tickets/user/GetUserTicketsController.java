package com.ffqts.arenape.presentation.controllers.tickets.user;

import com.ffqts.arenape.domain.services.tickets.user.IGetUserTicketsService;
import com.ffqts.arenape.presentation.dto.ticket.ConsumeTicketResponseDTO;
import com.ffqts.arenape.presentation.dto.ticket.PagedUserTicketsDTO;
import com.ffqts.arenape.presentation.dto.ticket.TicketCancellationResponseDTO;
import com.ffqts.arenape.presentation.utils.GetEmailFromTokenRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/ticket")
public class GetUserTicketsController {

    @Autowired
    private IGetUserTicketsService service;

    @GetMapping
    public ResponseEntity<PagedUserTicketsDTO> getUserTickets(
        HttpServletRequest req,
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer pageSize,
        @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
        @RequestParam(required = false, defaultValue = "desc") String sortDirection,
        @RequestParam(required = false) Boolean filterByValidity
    ) {
        var email = GetEmailFromTokenRequest.get(req);
        PagedUserTicketsDTO result = service.getUserTicketsPaginated(
            email,
            page,
            pageSize,
            sortBy,
            sortDirection,
            filterByValidity
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getTicketById(
        @PathVariable String ticketId,
        HttpServletRequest req
    ) {
        try {
            var email = GetEmailFromTokenRequest.get(req);
            var ticket = service.getByIdForUser(UUID.fromString(ticketId), email);
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("permissão")) {
                return ResponseEntity.status(403).body(new TicketCancellationResponseDTO(
                e.getMessage(),
                ticketId,
                "FORBIDDEN"
                ));
            }
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<PagedUserTicketsDTO> getUserTicketsByEvent(
        @PathVariable String eventId,
        HttpServletRequest req,
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer pageSize
    ) {
        var email = GetEmailFromTokenRequest.get(req);
        PagedUserTicketsDTO result = service.getByEventPaginated(
            email,
            eventId,
            page,
            pageSize
        );
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/{ticketId}")
    public ResponseEntity<ConsumeTicketResponseDTO> getTicketByIdAdmin(@PathVariable String ticketId) {
        var ticket = service.getByIdForAdmin(UUID.fromString(ticketId));
        return ResponseEntity.ok(ticket);
    }

}
